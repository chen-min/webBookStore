const actions  = {
    setFontFamilyVisible: ({ commit }, visible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', visible)
    },
    setDefalutFontFamily: ({commit }, font) => {
        return commit('SET_DEFAULT_FONT_FAMILY', font)
    },
    setDefaultFontSize: ({ commit }, fontSize) => {
        return commit('SET_DEFAULT_FONT_SIZE', fontSize)
    },
    setSettingVisible: ({ commit }, visible) => {
        return commit('SET_SETTING_VISIBLE', visible)
    },
    setMenuVisible: ({ commit }, visible) => {
        return commit('SET_MENU_VISIBLE', visible)
    },
    setFileName: ({ commit }, fileName) => {
        return commit('SET_FILENAME', fileName)
    },
    

}

export default actions
