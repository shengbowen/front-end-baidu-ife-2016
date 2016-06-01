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
        }
    },



    addValiate: function(obj){
        this.checkList = obj;
    },

    addHandler: function(){
        var self = this;
        self.el.addEventListener("blur", function(event){
            self.validate();
            var target = event.target;
            if(self.messages.length>0){
                var info = target.parentElement.nextElementSibling;
                info.classList.add("warn");
                info.getElementsByTagName("span")[0].innerHTML = self.messages[0];
            }
        });
    },

    validate: function(){
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



var uname = document.getElementById("name");
var unameValidate = new InputValidate(uname);
unameValidate.addValiate({notNull:true, maxLength:16, minLength:4});

var confirm = document.getElementById("confirm");
confirm.addEventListener("click", function(event){
    unameValidate.validate();
    var info = uname.parentElement.nextElementSibling;
    if(unameValidate.messages.length>0){
        info.classList.add("warn");
        info.getElementsByTagName("span")[0].innerHTML = unameValidate.messages[0];
    }else{
        info.classList.add("suc");
        info.getElementsByTagName("span")[0].innerHTML = "验证成功！";
    }
});