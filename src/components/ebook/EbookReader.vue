<template>
    <div class="ebook-reader">
        <div id="read">
        </div>
    </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Epub from 'epubjs'
import { setTimeout } from 'timers';
import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme,
    getLocation
} from '../../utils/localStorage'


global.ePub  = Epub
export default {
    mixins: [ebookMixin],
    methods: {
        initEpub(){
            console.log(' 进入init方法')
            const baseUrl = 'http://localhost:9000'
            // const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
            const url = baseUrl + '/epub/' + this.fileName + '.epub'
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            this.initRendition()
            this.initGesture()
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then(locations => {
                this.setBookAvailable(true)
                console.log(this.bookAvailable,'aval')
                this.refreshLocation()
            })

        },
        initRendition(){
            this.rendition = this.book.renderTo('read', {
            width: innerWidth,
            height: innerHeight,
            method: 'default'
            })
            // console.log(this.ren)
            this.rendition.display().then(() => {
                this.initFontSize()
                this.initFontFamily()
                this.initTheme()
                this.initGlobalStyle()
                this.refreshLocation()
            })
            this.rendition.hooks.content.register(contents => {
                let url = 'http://localhost:9000'
                Promise.all([
                    contents.addStylesheet(`${url}/fonts/daysOne.css`),
                    contents.addStylesheet(`${url}/fonts/cabin.css`),
                    contents.addStylesheet(`${url}/fonts/montserrat.css`),
                    contents.addStylesheet(`${url}/fonts/tangerine.css`),
                    ]).then(() => {
                    })
            })
        },
        initFontSize() {  
            let fontSize = getFontSize(this.fileName)
            if(!fontSize) {
                saveFontSize(this.fileName, this.defaultFontSize)
            } else {
              this.rendition.themes.fontSize(fontSize)
              this.setDefaultFontSize(fontSize)
            }
        },
        initFontFamily() {
            let font = getFontFamily(this.fileName)

            if (!font) {
              saveFontFamily(this.fileName, this.defaultFontFamily)
            } else {
              this.rendition.themes.font(font)
              this.setDefaultFontFamily(font)
            }        
        },
        initTheme() {
            let defaultTheme = getTheme(this.fileName)
            if(!defaultTheme) {
                defaultTheme = this.themeList[0].fileName
                saveTheme(this.fileName, defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            this.rendition.themes.select(defaultTheme)
        },
        initGesture(){
            this.rendition.on('touchstart', event => {
                this.touchStartX = event.changedTouches[0].clientX
                this.touchStartTime = event.timeStamp
            })
            this.rendition.on('touchend', event => {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                const time = event.timeStamp - this.touchStartTime
                if (time < 500 && offsetX > 40) {
                    this.prevPage()
                } else if (time < 500 && offsetX < -40) {
                    this.nextPage()
                } else {
                    this.toggleTitleAndMenu()
                }
                event.preventDefault()
                event.stopPropagation()
            })
        },
        prevPage(){
            if(this.rendition){
                this.rendition.prev().then(() => {
                    this.refreshLocation()
                })
            }
            this.hideTitleAndMenu()

        },
        nextPage() {
            if(this.rendition){
                this.rendition.next().then(() => {
                this.refreshLocation()
              })

            }
            this.hideTitleAndMenu()

        },
        toggleTitleAndMenu() {
            if (this.menuVisible) {
                this.setSettingVisible(-1)
                this.setFontFamilyVisible(false)

            }
            this.setMenuVisible(!this.menuVisible)
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => {
            console.log('mounted函数')
            this.initEpub()
        })
    }

}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 150;
      width: 100%;
      height: 100%;
    }
  }
</style>
