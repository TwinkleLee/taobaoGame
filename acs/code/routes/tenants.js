/**
 * 根据tenantName返回对应的主题页面
 */
const tenants = {
    'default':'index.html',
    'mark':'public/html/index_mark.html',
    'casio':'public/html/index_casio.html',
    'kidsland':'public/html/index_kissland.html',
    'caibai':'public/html/index_caibai.html',
}

function getPage(name){
    if(typeof name != 'string'){
        console.error('非法的租户名称'); 
        return false;
    }
    var tenantName = String.prototype.toLowerCase.call(name);
    if(tenantName in tenants){
        return  tenants[tenantName];
    }else{
        console.error('此租户名称未添加至租户名单');
        return false;
    }
}
module.exports = getPage;