import wepy from 'wepy'

export default class Global extends wepy.mixin {
  data = {
    imgBaseUrl: 'http://weiapp-assets.oss-cn-hangzhou.aliyuncs.com/',
    baseHeadImg: 'http://weiapp-assets.oss-cn-hangzhou.aliyuncs.com/default_head.png',
    baseServerImg: 'http://weiapp-assets.oss-cn-hangzhou.aliyuncs.com/default_pic.png',
    TenOral: '/pages/goods/index?id=55',
    tel400: '4008333055',
    reg: {
        empty:/^\s*$/,
        phone:/^1[34578]\d{1}[\d\*]{4}\d{4}$/,
        chinese:/^[\u4E00-\u9FA5]+$/,
        nochinese:/^[^\u4e00-\u9fa5]{0,}$/,       //不能出现中文
        noNumber:/^[0-9\u4e00-\u9fa5]+$/,		  //无数字
        name:/^[\u4E00-\u9FA5A-Za-z0-9]+$/,
        Num: /^[1-9][0-9]*$/,
        expressno:/^[0-9a-zA_Z]+$/,  //物流单号
        licenseno:/^[0-9a-zA-Z]*$/,		//许可证号 只能是字母或数字
        price:/^\d+(\.{0,1}\d+){0,1}$/ // 只能是正数
    },
    loadloop:true
  }
  methods = {
    default_head(e){
        // console.log('dfffff', e)
        if (e.target.dataset.img) {
            let arr = e.target.dataset.img.split(',')
            let tmp = this
            for(let i = 0; i < arr.length - 1; i++){
                tmp = tmp[arr[i]]
            }
            if (tmp) {
                tmp[arr[arr.length - 1]] = this.imgBaseUrl+'default_head.png'
            }
            this.$apply()
        }
    },
    default_pic(e){
        // console.log('dddddf', e.target.dataset)
        if (e.target.dataset.img) {
            let arr = e.target.dataset.img.split(',')
            let tmp = this
            for(let i = 0; i < arr.length - 1; i++){
                tmp = tmp[arr[i]]
            }
            if (tmp) {
                // console.log('dddddf', tmp, arr[arr.length - 1])
                tmp[arr[arr.length - 1]] = this.imgBaseUrl+'default_pic.png'
            }
            if(e.target.dataset.img.indexOf('parent')>-1){
                this.$parent.$apply()
            }else{
                this.$apply()
            }
        }
    },
  }

    // 数组显示
    arrView(val, key) {
        if (val == undefined) {
	        return;
	    }
	    let res = [];
	    val.forEach(function (element) {
	        if( key == undefined ) {
	            res.push(element);
	        }else{
	            res.push(element[key]);
	        }
	    }, this);
	    res = res.join('，');
	    return res;
    }

    //	金额格式化 千分位
	formatCurrency(num) {
        num != undefined || (num = '0.00');
        num = num.toString().replace(/\$|\,/g, '');
      // 检查传入数值为数值类型
        if (isNaN(num))
         num = "0";
      // 获取符号(正/负数)
        var sign = (num == (num = Math.abs(num)));

        num = Math.floor(num * Math.pow(10, 2) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
        var cents = num % Math.pow(10, 2); // 求出小数位数值
        num = Math.floor(num / Math.pow(10, 2)).toString(); // 求出整数位数值
        cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度

      // 补足小数位到指定的位数
        while (cents.length < 2)
         cents = "0" + cents;

       // 对整数部分进行千分位格式化.
         for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
          num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
         return (((sign) ? '' : '-') + num + '.' + cents);
     }

  // 弹出提示（有确认、取消按钮）
  showAlert(data, arg) {
    // data.showCancel 提示框的取消按钮默认为true，不显示传入false
    /* data.confirmColor 确认按钮的色值
       data.cancelColor 取消按钮的色值
       data.confirm 点击确认按钮触发的事件
       data.cancel 点击取消按钮触发的事件
    */
    // console.log(data, arg, 'obj')
    // console.log(this, 'ob')
    let that = this
    wepy.showModal({
        title: data.title?data.title:'',
        content: data.content?data.content:'',
        showCancel: data.showCancel==undefined?true:data.showCancel,
        confirmColor: data.confirmColor?data.confirmColor:'#4287ff',
        cancelColor: data.cancelColor?data.cancelColor:'#4287ff',
        confirmText: data.confirmText ? data.confirmText : '确定',
        cancelText: data.cancelText ? data.cancelText : '取消',
        }).then(res => {
            if (res.confirm) {
                if (typeof(that[data.confirm]) === 'function') {
                    that[data.confirm]()
                }
            } else if (res.cancel) {
                if (typeof(that[data.cancel]) === 'function') {
                    that[data.cancel]()
                }
            }
        })
    }

    // 显示成功提示（无按钮，黑底）
    showSuccess(title) {
        // title可不写
        wepy.showToast({
            title: title ? title : '操作成功',
            icon: 'success',
            mask: true
        })
    }

    // 显示加载动画，
    // hide 传入false则关闭加载提示
    showloading(hide) {
        this.loadloop = true
        let timer = null
        if (hide === false) {
            this.loadloop = false
            clearTimeout(timer)
            wx.hideLoading()
        } else {
            timer = setTimeout(() => {
                if (this.loadloop) {
                    wx.showLoading({title: '加载中'})
                }
            }, 500)
        }
    }

    regPhone(evalue) {
        let reg = new RegExp(/^1[34578]\d{1}[\d\*]{4}\d{4}$/)
        if (reg.test(evalue)) {
            return true
        }
    }
    regCode(evalue) {
        let reg = new RegExp(/^[1-9][0-9]*$/)
        if (reg.test(evalue)) {
            return true
        }
    }

    chooseImage(obj) {
        return new Promise((resolve, reject) => {
            wepy.chooseImage(obj).then(res => {
                let fileArr = res.tempFiles
                let pathArr = res.tempFilePaths
                let resArr = []
                pathArr.forEach((v, i) => {
                    let data = {
                        filePath: v,
                        file: fileArr[i]
                    }
                    this.getuploadsign(1, data).then(data => {
                        if (data.res.statusCode === 200) {
                            resArr.push(JSON.parse(data.res.data).data.source_url)
                        } else {
                            reject(data.res)
                        }
                        if (resArr.length === pathArr.length) {
                            resolve(resArr)
                        }
                    })
                })
            })
        })
    }
    getuploadsign(type, file) {
        return new Promise((resolve, reject) => {
            wepy.request({
                url: 'weiappapi/oss/getqclouduploadsign',
                noToken: true,
                data: {
                    type: type,
                    token: wepy.getStorageSync('token')
                }
            }).then(res => {
                if (res.code != 1) {
                    return;
                }
                let data = res.data;
                let baseData = {}
                baseData.url = res.data.host
                baseData.filePath = file.filePath
                baseData['Content-Length'] = Math.round(file.file.size * 100 / 1024) / 100
                this.uploadImg(baseData, data).then(res => {
                    resolve({res: res, url: baseData.url + '/' + data.key});
                }).catch(err => {
                    reject(err)
                });
            }).catch(err => {
                reject(err);
            })
        });
    }
    uploadImg(baseData, formData) {
        return new Promise((resolve, reject) => {
            let data = {
                ...baseData,
                formData
            }
            data.url = formData.cos_url
            data.header = {'Authorization': formData.authorization}
            data.formData = {op: 'upload'}
            data.filePath = baseData.filePath,
            data.name = 'filecontent'
            wepy.uploadFile(data).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    //	时间格式化   (YYYY-MM-DD HH:mm)
    transTime(time,opt = 'yyyy-MM-dd hh:mm'){
        if(time === '' || time === undefined){
            return
        }else{
            var time1 = new Date(time * 1000)
            var time2 = this.dateFormat(time1, opt);
            return time2;
        }
    }
    dateFormat(time1, fmt) {
		var o = {
			"M+": time1.getMonth() + 1, //月份
			"d+": time1.getDate(), //日
			"h+": time1.getHours(), //小时
			"m+": time1.getMinutes(), //分
			"s+": time1.getSeconds(), //秒
			"q+": Math.floor((time1.getMonth() + 3) / 3), //季度
			"S": time1.getMilliseconds() //毫秒
		};
		if(fmt=='' || fmt==undefined){
			fmt='';
		}else{
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time1.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return fmt;
    }
    // 百度地图返回城市code
    getCity(lat, lng) {
        return new Promise((resolve, reject) => {
            wepy.request({
                url: `https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${lat},${lng}&output=json&pois=1&ak=dG44joucgDmPp7aWmNd9F4WU`,
                noToken: true,
                baseUrl: '',
                data: {}
            }).then(res => {
                let re = res.slice(res.indexOf('(') + 1,-1)
                re = JSON.parse(re)
                resolve(re.result.addressComponent)
            })
        })
    }
    // 若用户未授权地理位置，则弹出设置页面
    getLocalSetting() {
        wepy.getSetting().then(res => {
            if (res.authSetting["scope.userLocation"] === true) {
                // this.getLocalinfo()
            } else {
                wepy.openSetting().then(res =>{
                    if (res.authSetting["scope.userLocation"] === true) {
                        console.log(res)
                        // 用户设置成功后，再次写入缓存信息中
                        wepy.getLocation().then(res => {
                            let currentCity = {}
                            currentCity.lng = res.longitude
                            currentCity.lat = res.latitude
                            wepy.setStorageSync('localinfo', JSON.stringify(this.currentCity))
                        })
                    }
                })
            }
        })
    }
    // 取经纬度信息
    localinfobyStorage() {
        let localinfo = {}
        if (wepy.getStorageSync('localinfo')) {
            localinfo = JSON.parse(wepy.getStorageSync('localinfo'))
        } else {
            localinfo = {lng: '', lat: ''}
            // wepy.getLocation().then(res => {
            //     console.log('重新获取坐标', res)
            //     localinfo = {lng: res.longitude, lat: res.latitude}
            // })
        }
        return localinfo
    }
    // 读取缓存中的用户信息
    getUserInfobyStorage() {
        let re = false
        if (wepy.getStorageSync('userData')) {
            re = JSON.parse(wepy.getStorageSync('userData'))
            re.wxName = re.user_name
            re.user_name = ''
            if (re.family_owner){
                let fa = re.family_owner
                re.user_name = fa.user_name
                re.avatar = fa.avatar
                re.gender = typeof(fa.gender) === 'object' ? fa.gender : {key: fa.gender, value: fa.gender === 1 ? '男' : '女'}
                re.mobile = fa.mobile
                re.nickname = fa.user_name ? fa.user_name : re.nickname
            }
        }
        return re
    }
    reSetUserInfo(list, type) {
        let info = JSON.parse(wepy.getStorageSync('userData'))
        if (type === 'mobile') {
            info.mobile = list
            info.family_owner = {
                mobile: list
            }
        } else {
            if (list.length > 0 && list[0].relation.key === 1){
                info.family_owner = {
                    avatar: list[0].avatar,
                    gender: list[0].gender,
                    mobile: list[0].mobile,
                    user_name: list[0].user_name
                }
            }
        }
        wepy.setStorageSync('userData', JSON.stringify(info))
    }
    checkBind() {
        let re = false
        if (wepy.getStorageSync('userData')) {
            let info = JSON.parse(wepy.getStorageSync('userData'))
            if (info.mobile) {
                re = true
            }
        }
        return re
    }
    // 检测返回路径的深度
    BackToDelta(url) {
        var pages = getCurrentPages()
        var backDelta = false
        Object.keys(pages).forEach((v) => {
            if ((pages[v].route).indexOf(url) > -1) {
                backDelta = pages.length - v - 1
            }
        })
        return backDelta
    }
    event() {

    }
    onShow() {
        // if(this.__route__ === 'pages/index'){
        //     return
        // }
        // if (wepy.getStorageSync('userData')) {
        //     if (!wepy.getStorageSync('token')){
        //         this.$parent.relogin('/' + this.$parent.getCurrentPageUrl())
        //     } else {
        //         this.$parent.checklogin().then(res =>{
        //             if (!res) {
        //                 wepy.removeStorage({key: 'token'})
        //                 this.$parent.relogin('/' + this.$parent.getCurrentPageUrl())
        //             } else {
        //                 if (typeof(this.PageInit) === 'function') {
        //                     this.PageInit()
        //                 }
        //             }
        //         })
        //     }
        // } else {
        //     this.$parent.userInfoReadyCallback = res => {
        //         if (typeof(this.PageInit) === 'function') {
        //             this.PageInit()
        //         }
        //     }
        // }
        if (typeof(this.PageInit) === 'function') {
            this.PageInit()
        }
    }

    onLoad() {
    }
}
