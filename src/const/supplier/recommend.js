const supType = {
    1: '代理',
    2: '制造',
    properties: [
        { label: "代理", value: 1 },
        { label: "制造", value: 2 }
    ]
}
const proType = {
    "成品": '成品',
    "包材": '包材',
    "原料": "原料",
    "其他": "其他",
    properties: [
        { label: "成品", value: "成品" },
        { label: "包材", value: "包材" },
        { label: "原料", value: "原料" },
        { label: "其他", value: "其他" }
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
export { supType, proType, simpleStatus }