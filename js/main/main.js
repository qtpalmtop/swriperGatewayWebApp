// 当前选中按钮索引
var currentButtonIndex = 4;

// 轮播按钮中心偏移量
var offset = 0;

// 主背景图片和主题名字对应模型
MAIN_BG_TITLE_MODEL = {
  '公共社区': 'images/main/main-bg-5.png',
  '企业用户': 'images/main/main-bg-4.png',
  '第三方机构用户': 'images/main/main-bg-3.png',
  '公众用户': 'images/main/main-bg-2.png',
  '环保用户': 'images/main/main-bg-1.png'
};

// 主内容窗口文字内容和主题名字对应模型
MAIN_CONTENT_BOX_TITLE_MODEL = {
  '公共社区': '企业需求、环保课堂、环保知识、优秀成果、法规标准，夯实亲清服务信息融合。',
  '企业用户': '一站式服务，在线咨询，助力环境治理，促进企业实现自我管理。',
  '第三方机构用户': '环评咨询、监测治理，搭建第三方机构环保超市桥梁，推进第三方机构和企业的供需交互。',
  '公众用户': '实时掌握区域环境，动态推送环保资讯、12369和厅长信箱，丰富公众参与环境治理方式',
  '环保用户': '运行分析，用户管理，提升平台运维管理能力'
};

// 轮播按钮模型
var buttonGroupModel = [
  {
    sortIndex: 1,
    oldIndex: 1,
    text: '第三方机构用户',
    isActived: false,
    style: {
      display: 'block',
      left: '10%'
    }
  },{
    sortIndex: 2,
    oldIndex: 2,
    text: '公众用户',
    isActived: false,
    style: {
      display: 'block',
      left: '30%'
    }
  },
  {
    sortIndex: 3,
    oldIndex: 3,
    text: '企业用户',
    isActived: true,
    style: {
      display: 'block',
      left: '50%'
    }
  },
  {
    sortIndex: 4,
    oldIndex: 4,
    text: '环保用户',
    isActived: false,
    style: {
      display: 'block',
      left: '70%'
    }
  },
  {
    sortIndex: 5,
    oldIndex: 5,
    text: '公共社区',
    isActived: false,
    style: {
      display: 'block',
      left: '90%'
    }
  }
];

// 轮播按钮配置
var buttonGroupConfigs = [];

window.onload = function() {

  // 实例化3D浮动标签
  var floatTags = new FloatTags();

  floatTags.init();

  init();

  setSwiperBtnsConfigs();
  resetSwiperBtns();

};

/**
 * 初始化
 */
function init() {
  // 加载插图从右边进入动画
  var contentBoxFloat4El = document.getElementsByClassName('content-box-float-4')[0];
  contentBoxFloat4El.style.left = '0';
}

/**
 * 跳转
 */
function goNext() {

}

/**
 * 渲染背景
 */
function renderMainBg() {
  var mainBgEl = document.getElementsByClassName('main')[0];
}

/**
 * 设置轮播按钮组配置
 */
function setSwiperBtnsConfigs() {

  buttonGroupConfigs = [];

  // 背景图动态更替
  buttonGroupModel = buttonGroupModel.map(function(item) {
    item.style.backgroundImage = `url(images/main/footer-btn-${item.isActived ? item.oldIndex + '-active' : item.oldIndex}.png)`;
    return item;
  });

  buttonGroupConfigs.push(
    Object.assign({}, buttonGroupModel[3], {style: {left: '-30%', transform: 'translateX(-80px)'}}),
    Object.assign({}, buttonGroupModel[4], {style: {left: '-10%', transform: 'translateX(-80px)'}}),
    ...buttonGroupModel,
    Object.assign({}, buttonGroupModel[0], {style: {left: '110%', transform: 'translateX(-80px)'}}),
    Object.assign({}, buttonGroupModel[1], {style: {left: '130%', transform: 'translateX(-80px)'}})
  );

  buttonGroupConfigs[0].style.backgroundImage = buttonGroupModel[3].style.backgroundImage;
  buttonGroupConfigs[1].style.backgroundImage = buttonGroupModel[4].style.backgroundImage;
  buttonGroupConfigs[7].style.backgroundImage = buttonGroupModel[0].style.backgroundImage;
  buttonGroupConfigs[8].style.backgroundImage = buttonGroupModel[1].style.backgroundImage;

}

/**
 * 重置轮播按钮视图
 */
function resetSwiperBtns() {

  var footerBtnsEl = document.getElementById('footerBtns');
  footerBtnsEl.innerHTML = '';

  buttonGroupConfigs.forEach(function(item, index) {

    var btnEl = document.createElement('a');

    Object.keys(item.style).forEach(function(key){btnEl.style[key] = item.style[key];});

    btnEl.innerHTML = `<span>${item.text}</span>`;

    btnEl.onclick = function(e) {

      console.log('in btnClick: item', item);
      offset = index - currentButtonIndex;

      changeMainBg(item.text);
      changeContentBoxText(item.text);
      changeContentBox(item.text);

      shouldScrollSwiperBtns(offset);

    };

    if (item.isActived) {
      btnEl.classList.add('active');
    } else {
      btnEl.classList.remove('active');
    }

    footerBtnsEl.appendChild(btnEl);

  });

}

/**
 * 准备滚动轮播按钮组
 * @params swriperOffset {number} 滚动距离
 */
function shouldScrollSwiperBtns(swriperOffset = 0) {

  var footerBtnsEl = document.getElementById('footerBtns');
  var btnEls = footerBtnsEl.getElementsByTagName('a');

  switch(swriperOffset) {
    case 0:
      return;
      break;
    case 1:
      // 右移一个

      // 倒数第二个隐藏
      if (btnEls[2].style.left === '-10%') {
        btnEls[3].style.display = 'none';
      } else {
        btnEls[2].style.display = 'none';
      }

      // 正数第二个显示
      if (btnEls[btnEls.length - 2].style.left === '90%') {
        btnEls[btnEls.length - 1].style.display = 'block';
      } else {
        btnEls[btnEls.length - 2].style.display = 'block';
      }

      buttonGroupModel = buttonGroupModel.map(function(item) {
        item.sortIndex = item.style.left !== '10%' ? item.sortIndex - 1 : 5;
        item.style.left = item.style.left !== '10%' ? `${getPercentNum(item.style.left) - swriperOffset * 20}%` : '90%';
        item.isActived = item.style.left === '50%' ? true : false;
        return item;
      });
      break;
    case 2:
      // 右移两个

      // 倒数第二、三个隐藏
      btnEls[2].style.display = 'none';
      btnEls[3].style.display = 'none';
      // 正数第二、三个显示
      btnEls[currentButtonIndex + 2].style.display = 'block';
      btnEls[currentButtonIndex + 1].style.display = 'block';

      buttonGroupModel = buttonGroupModel.map(function(item) {

        if (item.style.left === '30%') {
          item.sortIndex = 5;
          item.style.left = '90%';
        } else if (item.style.left === '10%') {
          item.sortIndex = 4;
          item.style.left = '70%';
        } else {
          item.sortIndex = item.sortIndex - 2;
          item.style.left = `${getPercentNum(item.style.left) - swriperOffset * 20}%`;
        }

        item.isActived = item.style.left === '50%' ? true : false;
        return item;
      });

      break;
    case -1:
      // 左移一个

      // 倒数第二个隐藏
      if (btnEls[btnEls.length - 3].style.left === '110%') {
        btnEls[btnEls.length - 4].style.display = 'none';
      } else {
        btnEls[btnEls.length - 3].style.display = 'none';
      }

      // 正数第二个显示
      if (btnEls[1].style.left === '10%') {
        btnEls[0].style.display = 'block';
      } else {
        btnEls[1].style.display = 'block';
      }

      buttonGroupModel = buttonGroupModel.map(function(item) {
        item.sortIndex = item.style.left !== '90%' ? item.sortIndex + 1 : 1;
        item.style.left = item.style.left !== '90%' ? `${getPercentNum(item.style.left) - swriperOffset * 20}%` : '10%';
        item.isActived = item.style.left === '50%' ? true : false;
        return item;
      });
      break;
    case -2:
      // 左移两个

      // 倒数第二、三个隐藏
      btnEls[btnEls.length - 3].style.display = 'none';
      btnEls[btnEls.length - 4].style.display = 'none';
      // 正数第二、三个显示
      btnEls[currentButtonIndex - 2].style.display = 'block';
      btnEls[currentButtonIndex - 1].style.display = 'block';

      buttonGroupModel = buttonGroupModel.map(function(item) {

        if (item.style.left === '90%') {
          item.sortIndex = 2;
          item.style.left = '30%';
        } else if (item.style.left === '70%') {
          item.sortIndex = 1;
          item.style.left = '10%';
        } else {
          item.sortIndex = item.sortIndex + 2;
          item.style.left = `${getPercentNum(item.style.left) - swriperOffset * 20}%`;
        }

        item.isActived = item.style.left === '50%' ? true : false;
        return item;
      });

      break;
    default:
  }

  // 视图滚动
  scrollSwiper(swriperOffset);

  // 重新排序
  buttonGroupModel.sort(function(a, b){return a.sortIndex - b.sortIndex;});

  setSwiperBtnsConfigs();

  setTimeout(function() {
    resetSwiperBtns();
  }, 300);

}

/**
 * 滑动轮播按钮组视图
 * @param scrollOffset {number} 滑动偏移量
 */
function scrollSwiper(scrollOffset = 0) {

  var footerBtnsEl = document.getElementById('footerBtns');
  var btnEls = footerBtnsEl.getElementsByTagName('a');
  var count = 0;

  do {
    btnEls[count].style.left = `${getPercentNum(btnEls[count].style.left) - scrollOffset * 20}%`;

    if (btnEls[count].style.left === '50%') {
      btnEls[count].style.width = '200px';
      btnEls[count].style.height = '70%';
      btnEls[count].style.transform = 'translateX(-100px)';
      btnEls[count].style.backgroundImage = btnEls[count].style.backgroundImage.includes('active') ?
        btnEls[count].style.backgroundImage :
        `${btnEls[count].style.backgroundImage.split('.png')[0]}-active.png`;
      btnEls[count].classList.add('active');
    }

    else if (btnEls[count].style.left === '30%' || btnEls[count].style.left === '70%') {
      btnEls[count].style.width = '180px';
      btnEls[count].style.height = '64%';
      btnEls[count].style.transform = 'translateX(-90px)';
      btnEls[count].style.backgroundImage = btnEls[count].style.backgroundImage.includes('active') ?
        `${btnEls[count].style.backgroundImage.split('-active.png')[0]}.png` :
        btnEls[count].style.backgroundImage;
      btnEls[count].classList.remove('active');
    }

    else if (btnEls[count].style.left === '10%' || btnEls[count].style.left === '90%') {
      btnEls[count].style.width = '160px';
      btnEls[count].style.height = '56%';
      btnEls[count].style.transform = 'translateX(-80px)';
      btnEls[count].style.backgroundImage = btnEls[count].style.backgroundImage.includes('active') ?
        `${btnEls[count].style.backgroundImage.split('-active.png')[0]}.png` :
        btnEls[count].style.backgroundImage;
      btnEls[count].classList.remove('active');
    }

  } while(++count < btnEls.length);

}

/**
 * 获取百分号前的数字
 * @returns {number}
 */
function getPercentNum(text) {
  return parseInt(text.split('%')[0]);
}

/**
 * 更换主背景
 * @param title {string} 主题名称
 */
function changeMainBg(title) {
  var mainEl = document.getElementsByClassName('main')[0];

  mainEl.style.backgroundImage = `url(${MAIN_BG_TITLE_MODEL[title]})`;
}

/**
 * 更换主内容窗口文字内容
 * @param title {string} 主题名称
 */
function changeContentBoxText(title) {
  var contentBoxEl = document.getElementById('contentText');

  contentBoxEl.innerHTML = `${MAIN_CONTENT_BOX_TITLE_MODEL[title]}`;
}

/**
 * 更换右侧内容插图和动态图
 * @param title {string} 主题名称
 */
function changeContentBox(title) {
  var contentBoxFloat1El = document.getElementsByClassName('content-box-float-1')[0];
  var contentBoxFloat21El = document.getElementsByClassName('content-box-float-2-1')[0];
  var contentBoxFloat22El = document.getElementsByClassName('content-box-float-2-2')[0];
  var contentBoxFloat3El = document.getElementsByClassName('content-box-float-3')[0];
  var contentBoxFloat4El = document.getElementsByClassName('content-box-float-4')[0];
  var contentBoxFloat5El = document.getElementsByClassName('content-box-float-5')[0];

  contentBoxFloat21El.style.right = '100%';
  contentBoxFloat22El.style.left = '100%';
  contentBoxFloat1El.style.top = '100%';
  contentBoxFloat3El.style.left = '100%';
  contentBoxFloat4El.style.left = '100%';
  contentBoxFloat5El.style.left = '100%';

  switch(title) {
    case '公共社区':
      contentBoxFloat5El.style.left = '50%';
      break;
    case '企业用户':
      // 从右往左滑出
      contentBoxFloat4El.style.left = '0';
      break;
    case '第三方机构用户':
      // 从右往左滑出
      contentBoxFloat3El.style.left = '0';
      break;
    case '公众用户':
      contentBoxFloat21El.style.right = '50%';
      contentBoxFloat22El.style.left = '45%';
      break;
    case '环保用户':
      // 从下往上滑出
      contentBoxFloat1El.style.top = '0';
      break;
    default:
  }

}
