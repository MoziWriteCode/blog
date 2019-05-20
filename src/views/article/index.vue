<template>
  <div>
    <div class="articles">
      <div class="infos">
        <div class="newsview">
          <p class="intitle"></p>
          <h3 class="news_title">{{article.article_title}}</h3>
          <div class="news_author">
            <span v-if="article.author">
              <i class="fa fa-user-o au01" aria-hidden="true"></i>
              {{article.author}}
            </span>
            <span>
              <i class="fa fa-clock-o au02" aria-hidden="true"></i>
              {{article.article_update_time | formatDate}}
            </span>
            <span class="au03">
              获得
              <b>{{article.ready_number}}</b>次围观
            </span>
          </div>
          <div class="tags">
            <a href="/" v-for="tag in article.tags" :key="tag.tagId">{{tag.name}}</a>
          </div>
          <div class="news_about">
            <div v-html="article_content" class="markdown-body"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="markTitle" v-if="markdownList.length > 0">
      <p>文章目录:</p>
      <div class="markTitleList">
        <markDownTitle
          :list="markdownList"
          :curLiHeight="curLiHeight"
          :curLiTop="curLiTop"
          :highlightIndex="highlightIndex"
        ></markDownTitle>
      </div>
    </div>
  </div>
</template>

<script>
import getMKTitles from "@/utils/getMKTitles";

import "../../assets/style/atom.min.css";
import "../../assets/style/github-markdown.css";
import markDownTitle from "@/components/markDownTitle";
import { getArticle } from "@/api/article";
import { parseTime } from "@/utils/";

import markdown from "@/utils/marked";

export default {
  data() {
    return {
      markdownList: [],
      markdownTitleLen: 0,
      highlightIndex: 0,
      article: {},
      article_content: "",
      markDownTitleHeight: 0,
      curLiHeight: 0, //导航当前li的高度
      curLiTop: 0 //距顶部的距离
    };
  },
  computed: {
    keywords() {
      let keywords = [];
      this.article.tags.forEach(function(element) {
        keywords.push(element.name);
      });
      return keywords;
    }
  },
  components: {
    markDownTitle
  },
  created() {
    let { id = "" } = this.$route.query;
    this.$nextTick(() => {
      this.$store.dispatch("getRightBar", false);
    });
    getArticle(id).then(res => {
      this.article = res;
      this.getMKArray();
    });
  },
  mounted() {
    window.addEventListener("scroll", this.scrollHandler);
  },
  filters: {
    formatDate(val) {
      return parseTime(parseInt(val));
    }
  },
  methods: {
    getMKArray() {
      let getMKArray = getMKTitles(this.article.article_content);
      this.article_content = markdown(
        this.article.article_content,
        false,
        true
      );
      if (getMKArray && getMKArray.nav.length > 0) {
        this.markdownTitleFalse = true;
        this.markdownList = getMKArray.nav;
        this.markdownTitleLen = getMKArray.length;
        //计算第一个li的高度 只能到组件加载以后进行计算
        this.$nextTick(function() {
          this.curLiHeight = document.querySelector(
            `a[href="#titleAnchor-0"]`
          ).offsetHeight;
          this.markDownTitleHeight = document.querySelector(
            ".markTitleList"
          ).clientHeight;
        });
      }
    },
    scrollHandler(event, position) {
      if (this.markdownList.length === 0) return;
      const idPrefix = "titleAnchor-";
      const distance = 20;
      let list = [];
      for (let i = 0; i < this.markdownTitleLen; i++) {
        let dom = document.getElementById(`${idPrefix}${i}`);
        let domTitle = document.querySelector(`a[href="#titleAnchor-${i}"]`);
        list.push({
          y: dom.getBoundingClientRect().top, // 利用dom.getBoundingClientRect().top可以拿到元素相对于显示器的动态y轴坐标
          index: i,
          domTitle
        });
      }
      console.log(list.filter(item => item.y > distance))
      let readingVO = list
        .filter(item => item.y > distance)
        .sort((a, b) => {
          return a.y - b.y;
        })[0];
        console.log(readingVO)
      if (readingVO && readingVO.domTitle && readingVO.index!==0) {
        // 对所有的y值为正标的题，按y值升序排序。第一个标题就是当前处于阅读中的段落的标题。也即要高亮的标题
        this.highlightIndex = !readingVO ? 0 : readingVO.index-1;
        this.curLiHeight = readingVO.domTitle.offsetHeight;
        let toTop = readingVO.domTitle.offsetTop - this.markDownTitleHeight;
        document.querySelector(".markTitleList").scrollTop =
          toTop + this.markDownTitleHeight / 2;
        this.curLiTop = readingVO.index == 1? this.curLiTop: readingVO.domTitle.offsetTop - this.curLiHeight;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
    this.$store.dispatch("getRightBar", true);
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.markTitle {
  position: fixed;
  left: 67%;
  top: 65px;
  bottom: 50px;
  width: 25%;
}

.markTitleList {
  position: absolute;
  top: 35px;
  bottom: 100px;
  overflow-y: scroll;
}

.markTitle p {
  font-size: 16px;
}

.articles {
  width: 66%;
  float: left;
}

.infos {
  width: 100%;
  background: #fff;
  overflow: hidden;
  margin-top: 20px;
}

.newsview {
  padding: 20px;
}

.intitle {
  border-bottom: #000 2px solid;
}

.news_title {
  font-size: 24px;
  font-weight: normal;
  padding: 20px 0;
  color: #333;
}

.news_author {
  width: 100%;
  color: #999;
  line-height: 18px;
}

.news_author span {
  margin-right: 10px;
}

.au01 {
  color: #e06c75;
  padding: 0 5px;
}

.au02 {
  color: #333333;
  padding: 0 5px;
}

.au03 b {
  color: #333;
  padding: 0 5px;
}

.au04 {
  font-weight: normal;
}

.news_about {
  color: #888888;
  border: 1px solid #f3f3f3;
  padding: 10px;
  margin: 20px auto 15px auto;
  line-height: 23px;
  background: none repeat 0 0 #f6f6f6;
}

.news_about strong {
  color: #38485a;
  font-weight: 400 !important;
  font-size: 13px;
  padding-right: 8px;
}

.news_content {
  line-height: 24px;
  font-size: 14px;
}

.news_content p {
  overflow: hidden;
  padding-bottom: 4px;
  padding-top: 6px;
  word-wrap: break-word;
}

.tags a {
  background: #f4650e;
  padding: 3px 8px;
  margin: 0 5px 0 0;
  color: #fff;
}

.tags {
  margin: 10px 0;
}

.news_infos {
  line-height: 24px;
  text-align: justify;
}

.news_infos p {
  margin-bottom: 10px;
}

.news_infos img {
  max-width: 650px;
}

.share {
  padding: 20px;
}

.xzsm ul,
.ffsm ul {
  padding: 20px;
  line-height: 24px;
  border-top: 6px solid #a6b5c5;
}

.bt-blue {
  display: block;
  line-height: 40px;
  height: 40px;
  background: #1e8ec5;
  width: 100px;
  text-align: center;
}

.bt-blue a {
  color: #fff;
}

@media screen and (max-width: 680px) {
  .markTitle {
    display: none;
  }
  .articles {
    width: 100%;
  }
}
</style>