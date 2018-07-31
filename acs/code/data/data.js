
     
const _data = {
    'appKey':'23492108',
    'secret':'b932a73e06f773bff052297f364d7040',
    'troncellSession': '6101715c2750a57e7f143f41ce594bad793b971abd0a3f83016828600',
    'markSession':'6200625538cea6a78d07e1bd2fbe17fb5ZZ9989887bb23b94399436',
    'kidslandSession':'62020159f4cc03ace71f43ceg38a48625107000cd5ac27b859385837',
    'casioSession':'6201d236f05a97b8ebf41f83e5b08e7ZZ288f8b9f3da85d749901026',
    'faceGroupType': 'TaobaoMember',
    'markDeviceId': '57E3FE64C4',
    'markDeviceName': '云货架魔镜001',
    'kidslandDeviceId':['99E970CCA0','60E23F2979']
};
function getData(k){
    if(Object.keys(_data).indexOf(k)+1==0){return;}
    return _data[k];
}
module.exports = getData;