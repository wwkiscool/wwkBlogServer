
const func1 = () => {
    Promise.resolve().then(() => {
        console.log(0);
        return Promise.resolve(4);
    }).then((res) => {
        console.log(res)
    })

    Promise.resolve().then(() => {
        console.log(1);
    }).then(() => {
        console.log(2);
    }).then(() => {
        console.log(3);
    }).then(() => {
        console.log(5);
    });
}
const func2 = () => {
    Promise.resolve().then(() => {
        console.log(0);
        return Promise.resolve(4);
    }).then((res) => {
        console.log(res)
    })

    Promise.resolve().then(() => {
        console.log(1);
    }).then(() => {
        console.log(2);
    }).then(() => {
        console.log(3);
    }).then(() => {
        console.log(5);
    });
}
const func3 = () => {
    Promise.resolve().then(() => {
        console.log(0);
        return Promise.resolve(4);
    }).then((res) => {
        console.log(res)
    })

    Promise.resolve().then(() => {
        console.log(1);
    }).then(() => {
        console.log(2);
    }).then(() => {
        console.log(3);
    }).then(() => {
        console.log(5);
    });
}
const func4 = () => {
    Promise.resolve().then(() => {
        console.log(0);
        return Promise.resolve(4);
    }).then((res) => {
        console.log(res)
    })

    Promise.resolve().then(() => {
        console.log(1);
    }).then(() => {
        console.log(2);
    }).then(() => {
        console.log(3);
    }).then(() => {
        console.log(5);
    });
}


const defineProperty = () => {
    const person = {
        firstName: 'aaa',
        lastName: 'bbb'
    }
    Object.defineProperty(person, 'firstName', {
        get() {
            console.log(`获取firstName 的值为${this._firstName}`);

            return this._firstName
        },
        set(value) {
            this._firstName = value
            console.log(`firstName 改变为: ${value}`);
            console.log("dd", person);
            
        },
        configurable: true // 可以重新配置
    })
    person.firstName = 'bbb'
    console.log("aa", person);
}




const this2 = () => {
    let length = 10
    function fn () {
        return this.length + 1
    }
    const obj = {
        length: 5,
        test1: function () {
            return fn()
        }
    }
    obj.test2 = fn
    console.log("1", obj.test1()); // 6
    console.log("3", fn());
    console.log(obj.test2());
}
const queote = () => {
    const a = {age: 1}
    const b = 1
    const fn = (a, b) => {
        a.age = 2
        b = 3
        console.log("A", a);
        console.log('B', b )
    }
    
    
    fn(a, b)
    console.log("a", a);
    console.log("b", b);
}


const needExportFunc =  {
    func1,
    func2,
    func3,
    func4,
    defineProperty,
    this2,
    queote
}
// 如果直接运行 index.js，根据命令行参数调用方法
if (require.main === module) {
    const args = process.argv.slice(2); // 获取命令行参数
    const methodName = args[0];
    const methodArgs = JSON.parse(args[1]);

    const methods = needExportFunc;
    if (methods[methodName]) {
        const result = methods[methodName](...methodArgs);
        if (result !== undefined) {
            console.log(result);
        }
    } else {
        console.error(`Method "${methodName}" not found.`);
    }
}


module.exports = {
    ...needExportFunc
}