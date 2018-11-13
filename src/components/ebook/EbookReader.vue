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
            this.initRendition()
            this.initGesture()

        },
        initRendition(){
            this.rendition = this.book.renderTo('read', {
            width: innerWidth,
            height: innerHeight,
            method: 'default'
            })
            // console.log(this.ren)
            this.rendition.display()
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
            })
        },
        prevPage(){
            if(this.rendition){
                this.rendition.prev()
            }
        },
        nextPage() {
            if(this.rendition){
                this.rendition.next()
            }
        },
        toggleTitleAndMenu() {
            this.setMenuVisible(!this.menuVisible)
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log(this.$route.params.fileName,'this.$route.params.fileName')
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
