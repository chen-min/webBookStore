import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      let url = 'http://localhost:9000'
      switch (this.defaultTheme) {
        case 'Default': 
          addCss(`${url}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${url}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${url}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${url}/theme/theme_night.css`)
          break
        default:
          addCss(`${url}/theme/theme_default.css`)
          break
      }

    }
  }
}
