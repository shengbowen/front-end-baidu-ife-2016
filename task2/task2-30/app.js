function InputValidate(el){
    this.el = el;
    this.checkList = {};
    this.messages = [];
}

InputValidate.prototype = {
    constructor: InputValidate,

    valiateList: {
        notNull:{
            validate: function(value){
                return value !== "";
            },
            instruction:"不能为空!"
        },
        maxLength: {
            validate: function(value, maxLen){
                return getStringLength(value) < 16;
            },
            instruction:"不能超过16个字符"
        },
        minLength: {
            validate: function(value, minLength){
                return getStringLength(value) >= 4;
            },
            instruction: "不能少于4个字符"
        },

        email: {
            validate: function(value){
                var emRegx = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
                return emRegx.test(value);
            },
            instruction: "无效的邮箱地址"
        },
        tel:{
            validate: function(value){

            },
            instruction:"无效的电话"
        }
    },



    addValiate: function(obj){
        this.checkList = obj;
    },

    addBlurEvent: function(infoMsg){
        var self = this;
        self.el.addEventListener("blur", function(event){
            self.validate(infoMsg);
        });
    },

    addFocusEvent: function(infoMsg){
        var self = this;
        self.el.addEventListener("focus", function(event){
            var target = event.target, id=target.id,
                info = target.parentElement.nextElementSibling;
                info.display = "block";
                info.className = "";
                info.getElementsByTagName("span")[0].innerHTML =  infoMsg[id].hint;
        });
    },

    validate: function(infoMsg){
        var checks = this.checkList, v, arg;
        this.messages = [];
        for(var i in checks){
            if(checks.hasOwnProperty(i)){
                checker = this.valiateList[i];
                arg = checks[i];
                if(!checker){
                    throw {
                        name: "ValidateError",
                        message:"no handler to validate type" +i
                    };
                }
                result = checker.validate(this.el.value.trim(), arg);
                if(!result){
                    this.messages.push(checker.instruction);
                }
            }
        }

        var id=this.el.id,
            info = this.el.parentElement.nextElementSibling;
            info.classList.remove("info");
        if(this.messages.length>0){
            info.classList.add("warn");
            info.getElementsByTagName("span")[0].innerHTML = this.messages[0];
            return false;
        }else{
            info.classList.add("suc");
            info.getElementsByTagName("span")[0].innerHTML =  infoMsg[id].suc;
            return true;
        }

    },
}

//计算字符串长度，区分中英文
var getStringLength= function(str){
    var result=0, len=str.length, charCode = -1;
    for(var i=0; i<len;i++){
        charCode = str.charCodeAt(i);
        if(charCode>=0 && charCode<=128){
            result += 1;
        }else{
            result += 2;
        }
    }
    return result;
}

//绑定事件函数
var focusHandler = function(){

};

var info = {
            uname:{hint:"必填，长度为4-16个字符", suc:"验证成功！"},
            pass1:{hint:"密码是4-16个字符包含字母数字", suc:"密码可用！"},
            pass2:{hint:"再次输入相同密码", suc:"密码输入一致"},
            email:{hint:"输入正确的邮箱地址", suc:"邮箱可用"},
            tel:{hint:"输入正确的电话", suc:"电话可用"}   
         };

var form = document.forms.signin;
var uname = form.uname;
var unameValidate = new InputValidate(uname);
unameValidate.addValiate({notNull:true, maxLength:16, minLength:4});
unameValidate.addBlurEvent(info);
unameValidate.addFocusEvent(info);

var pass1 = form.pass1;
var pass1Validate = new InputValidate(pass1);
pass1Validate.addValiate({notNull:true, maxLength:16, minLength:4, });
pass1Validate.addBlurEvent(info);
pass1Validate.addFocusEvent(info);

var pass2 = form.pass2;
pass2.addEventListener("blur", function(event){
    checkTwoPass(pass1, pass2);
});

function checkTwoPass(pass1, pass2){
    var infoDiv = pass2.parentElement.nextElementSibling,
        id=pass2.id,
        span = infoDiv.getElementsByTagName("span")[0];
    if(pass1.value != pass2.value){
        infoDiv.classList.add("warn");
        span.innerHTML = "两次输入不一致";
    }else{
        infoDiv.classList.add("suc");
        span.innerHTML = "密码输入一致";
    }
}

var email = form.email;
var emailValidate = new InputValidate(email);
emailValidate.addValiate({notNull:true, email:true});
emailValidate.addBlurEvent(info);
emailValidate.addFocusEvent(info);

var tel = form.tel;
var telValidate = new InputValidate(tel);
telValidate.addValiate({notNull:true,tel:true});
telValidate.addBlurEvent(info);
telValidate.addFocusEvent(info);


var confirm = document.getElementById("confirm");
confirm.addEventListener("click", function(event){
    if(unameValidate.validate(info)&&pass1Validate.validate(info)&&checkTwoPass(pass1,pass2)
           &&emailValidate.validate(info)&&telValidate.validate(info)){
        alert("提交成功！")
    }else{
        alert("提交失败！")
    }
});