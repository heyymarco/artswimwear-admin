// types:
export interface TabOptionItem<TValue extends any = string>
{
    value        : TValue
    label       ?: React.ReactNode
    description ?: React.ReactNode
}
