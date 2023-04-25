// defaults:
const _defaultTabPanelStyle : TabPanelStyle = 'fit-content'



// hooks:

// variants:

//#region TabPanelVariant
export type TabPanelStyle = 'fit-content'|'max-content' // might be added more styles in the future
export interface TabPanelVariant {
    tabPanelStyle ?: TabPanelStyle
}
export const useTabPanelVariant = ({tabPanelStyle = _defaultTabPanelStyle}: TabPanelVariant) => {
    return {
        class: (tabPanelStyle === 'fit-content') ? null : tabPanelStyle,
    };
};
//#endregion TabPanelVariant
