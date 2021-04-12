const checkStatus = {
    "0": '待准',
    "1": '通过',
    "2": '不通过',
    properties: [
        { label: "待准", value: "0" },
        { label: "通过", value: "1" },
        { label: "不通过", value: "2" }
    ]
}
const enableStatus = {
    "false": '禁用',
    "true": '启用',
    properties: [
        { label: "禁用", value: false },
        { label: "启用", value: true }
    ]
}
const simpleStatus = {
    "false": '否',
    "true": '是',
    properties: [
        { label: "否", value: false },
        { label: "是", value: true }
    ]
}
const gender = {
    "0": '保密',
    "1": '男',
    "2": '女',
    properties: [
        { label: "保密", value: "0" },
        { label: "男", value: "1" },
        { label: "女", value: "2" }
    ]
}
export { checkStatus, enableStatus, simpleStatus, gender }