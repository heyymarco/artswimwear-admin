// models:
import {
    // types:
    type DefaultShippingOriginDetail,
    type ShippingAddressDetail,
    type ShippingLabelDetail,
}                           from '@/models'

// easypost:
import {
    getEasyPostInstance,
}                           from './instance'
import {
    normalizeShippingProviderName,
}                           from './utilities'

// others:
import {
    Country,
    State,
    City,
}                           from 'country-state-city'



export interface GetShippingLabelsOptions {
    originAddress       : DefaultShippingOriginDetail,
    shippingAddress     : ShippingAddressDetail
    totalProductWeight  : number
}
export const getShippingLabels = async (options: GetShippingLabelsOptions): Promise<ShippingLabelDetail[]> => {
    // options:
    const {
        originAddress,
        shippingAddress,
        totalProductWeight: totalProductWeightInKg,
    } = options;
    const totalProductWeightInKgStepped = (
        Math.round(totalProductWeightInKg / 0.25)
        * 0.25
    );
    const totalProductWeightInOzInteger = Math.max(1, // min 1 oz
        Math.round( // round to nearest integer of oz
            totalProductWeightInKgStepped * 35.274 // converts kg to oz
        )
    );
    const totalProductWeightInOzStepped = (
        (totalProductWeightInOzInteger < 16)
        ? totalProductWeightInOzInteger
        : (
            Math.ceil(totalProductWeightInOzInteger / 16)
            *
            16
        )
    );
    
    
    
    // test:
    // originAddress.country     = 'US';
    // originAddress.state       = 'California';
    // originAddress.city        = 'San Francisco';
    // originAddress.zip         = '94104';
    // 
    // shippingAddress.country   = 'US';
    // shippingAddress.state     = 'California';
    // shippingAddress.city      = 'Redondo Beach';
    // shippingAddress.zip       = '90277';
    // shippingAddress.address   = '179 N Harbor Dr';
    // 
    // shippingAddress.firstName = 'Steve Brule';
    // shippingAddress.lastName  = 'Brule';
    // shippingAddress.phone     = '4155559999';
    
    
    
    // normalize some origin & destination properties to produce shareable cache's key:
    
    const originCountry          = originAddress.country.trim();
    const originCountryCode      = (
        (originCountry.length === 2)
        ? originCountry.toUpperCase()
        : ((): string|undefined => {
            const originCountryLowercase = originCountry.toLowerCase();
            return Country.getAllCountries().find(({name}) => (name.toLowerCase() === originCountryLowercase))?.isoCode;
        })()
    );
    const originState            = originAddress.state.trim();
    const originStateCode        = (
        !originCountryCode
        ? undefined
        : ((): string|undefined => {
            const originStateLowercase = originState.toLowerCase();
            return State.getStatesOfCountry(originCountryCode).find(({name}) => (name.toLowerCase() === originStateLowercase))?.isoCode;
        })()
    );
    const originCity             = originAddress.city.trim();
    const originCityCode         = (
        (!originCountryCode || !originStateCode)
        ? undefined
        : ((): string|undefined => {
            const originCityLowercase = originCity.toLowerCase();
            return City.getCitiesOfState(originCountryCode, originStateCode).find(({name}) => (name.toLowerCase() === originCityLowercase))?.name
        })()
    );
    const originZip              = originAddress.zip?.trim().toUpperCase();
    
    const destinationCountry     = shippingAddress.country.trim();
    const destinationCountryCode = (
        (destinationCountry.length === 2)
        ? destinationCountry.toUpperCase()
        : ((): string|undefined => {
            const destinationCountryLowercase = destinationCountry.toLowerCase();
            return Country.getAllCountries().find(({name}) => (name.toLowerCase() === destinationCountryLowercase))?.isoCode;
        })()
    );
    const destinationState       = shippingAddress.state.trim();
    const destinationStateCode   = (
        !destinationCountryCode
        ? undefined
        : ((): string|undefined => {
            const destinationStateLowercase = destinationState.toLowerCase();
            return State.getStatesOfCountry(destinationCountryCode).find(({name}) => (name.toLowerCase() === destinationStateLowercase))?.isoCode;
        })()
    );
    const destinationCity        = shippingAddress.city.trim();
    const destinationCityCode    = (
        (!destinationCountryCode || !destinationStateCode)
        ? undefined
        : ((): string|undefined => {
            const destinationCityLowercase = destinationCity.toLowerCase();
            return City.getCitiesOfState(destinationCountryCode, destinationStateCode).find(({name}) => (name.toLowerCase() === destinationCityLowercase))?.name
        })()
    );
    const destinationZip         = shippingAddress.zip?.trim().toUpperCase();
    
    
    
    const easyPost = getEasyPostInstance();
    if (!easyPost) return [];
    
    
    
    const shipment = await easyPost.Shipment.create({
        from_address: {
            country   : originCountryCode ?? originCountry,
            state     : originStateCode ?? originState,
            city      : originCityCode ?? originCity,
            zip       : originZip || undefined, // maybe optional (empty string => undefined)
            street1   : originAddress.address,
            
            company   : originAddress.company   || undefined, // maybe optional (empty string => undefined)
            firstName : originAddress.firstName || undefined, // maybe optional (empty string => undefined)
            lastName  : originAddress.lastName  || undefined, // maybe optional (empty string => undefined)
            phone     : originAddress.phone     || undefined, // maybe optional (empty string => undefined)
        },
        to_address: {
            country   : destinationCountryCode ?? destinationCountry,
            state     : destinationStateCode ?? destinationState,
            city      : destinationCityCode ?? destinationCity,
            zip       : destinationZip || undefined, // maybe optional (empty string => undefined)
            street1   : shippingAddress.address,
            
            firstName : shippingAddress.firstName,
            lastName  : shippingAddress.lastName,
            phone     : shippingAddress.phone,
        },
        parcel: {
            weight: totalProductWeightInOzStepped,
        },
        // carrier_accounts : [
        //     // 'ca_dfa4ef16f792459684684fe4adb9d15a', // USPS: GroundAdvantage, Express, Priority
        //     // 'ca_204ed43d30614919b933bb446d92cf02', // FedExDefault: FEDEX_GROUND, FEDEX_EXPRESS_SAVER, FEDEX_2_DAY, FEDEX_2_DAY_AM, SMART_POST, PRIORITY_OVERNIGHT, STANDARD_OVERNIGHT
        // ],
    });
    const rates = shipment.rates;
    const shippingLabelDetails : ShippingLabelDetail[] = (
        (await Promise.all(
            rates
            .map(async (rate): Promise<ShippingLabelDetail|undefined> => {
                const carrierNameRaw   = rate.carrier;
                const serviceNameRaw   = rate.service;
                const combinedName = normalizeShippingProviderName(carrierNameRaw, serviceNameRaw);
                
                
                
                const amountRaw = rate.rate;
                if (!amountRaw) return undefined; // invalid data
                const amount = Number.parseFloat(amountRaw);
                if (!isFinite(amount)) return undefined; // invalid data
                
                
                
                return {
                    id         : rate.id,
                    name       : combinedName,
                    
                    eta        : ((typeof(rate.delivery_days) !== 'number') || (rate.delivery_days <= 0)) ? null : {
                        min    : rate.delivery_days,
                        max    : rate.delivery_days,
                    },
                    rate       : amount,
                } satisfies ShippingLabelDetail;
            })
        ))
        .filter((rate): rate is Exclude<typeof rate, undefined> => (rate !== undefined))
        // .toSorted((a, b) => (!a.name || !b.name) ? 0 : (a.name < b.name) ? -1 : 1)
        .toSorted((a, b) => (a.rate - b.rate))
    );
    return shippingLabelDetails;
}