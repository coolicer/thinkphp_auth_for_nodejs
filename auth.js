var php = require('phpjs')
var Auth = function(){
    this.config = {
        'AUTH_ON'           : true,
        'AUTH_TYPE'         : 1,
        'AUTH_GROUP'        : 'auth_group',
        'AUTH_GROUP_ACCESS' : 'auth_group_access',
        'AUTH_RULE'         : 'auth_rule',
        'AUTH_USER'         : 'users'
    }
};

    /**
      * 检查权限
      * @param name string|array  需要验证的规则列表,支持逗号分隔的权限规则或索引数组
      * @param uid  int           认证用户的id
      * @param string mode        执行check的模式
      * @param relation string    如果为 'or' 表示满足任一条规则即通过验证;
      *                           如果为 'and'则表示需满足所有规则才能通过验证
      * @return boolean           通过验证返回true;失败返回false
      */

Auth.prototype.check = function(name,uid,type,mode,relation){
    if(type == null) type = 1
    if(mode == null) mode = 'url'
    if(relation == null) relation = 'or'
    // 如果不使用验证，则直接返回ture
    if(!this.config['AUTH_ON']) return true
    // 获取用户需要验证的所有有效规则列表
    var authList = this.getAuthList(uid,type)
    if(is_string(name)){
          name = name.toLowerCase()
          if(name.indexOf(',')){
              name = name.split(',')
          }else{
              name = name
          }
    }
    // 保存验证通过的规则名
    if(mode == 'url'){
        req = JSON.parse( JSON.stringify(req.body) )).toLowerCase() );
    }
    authList.forEach(function(auth){
        var query = auth.replace(/^.+\?/,'') // 取query
        var parem = {};
        if( mode == 'url' && query != auth){
            php.parse_str(query, param)
            var intersect = php.array_intersect_assoc(req, param)
            auth = auth.replace(/\?.*$/,'')
            if( php.in_array(auth, name) && JSON.stringify(intersect) == JSON.stringify(param) ){
                list.push(auth)
            }
        }else if( php.in_array(auth, name) ){
            list.push(auth)
        }
    })
    if( relation == 'or' && !php.empty(list) ) return true
    var diff = php.array_diff(name, list)
    if( relation == 'and' && php.empty(diff) ) return true
    return false
};
    /**
     * 获得权限列表
     * @param integer uid 用户id
     * @param integer type
     */
Auth.prototype.getAuthList = function(uid,type){
    var _authList = [] // 保存用户验证通过的权限列表
    var t = type.join()
    if( php.isset( _authList[uid + t]) ) {
        return _authList[uid + t]
    }
    // 登录验证，暂不实现
    if( this.config['AUTH_TYPE'] == 2 ) {
        
    }

    // 读取用户所属的用户组
    var groups = this.getGroups(uid)
    // 保存用户所属用户组设置的所有权限规则id
    var ids = []
    groups.forEach(function(g){
        ids = php.array_merge( ids, php.explode( ',', php.trim( g['rules'], ',')) )
    })
    ids = php.array_unique(ids); // 数组去重
    if( php.empty(ids) ) {
        _authList[uid + t] = []
        return []
    }
    var map = { 
        "id": ["in",ids],
        "type": type,
        "status": 1
    }
    // 获取rules
    var rules = getFromDb()

    // 循环规则，判断结果
    authList = []
    rules.forEach(function(rule){
        if( !php.empty( rule['condition']) ){  //根据condition进行验证
            var user = this.getUserInfo(uid) // 获取用户信息，一维数组
            
            var command = rule['condition'].replace(/\{(\w*?)\}/, 'user[\'$1\']')
            var condition
            eval( 'condition = (' + command + ')')
            if(condition){
                authList = rule['name'].toLowerCase()
            }
        } else {
            // 只要存在就记录
            authList = rule['name'].toLowerCase()
        }
    })
    _authList[uid + t] = authList
    if( this.config['AUTH_TYPE'] == 2 ) {
        //规则列表保存到session
    }
    return php.array_unique( authList )
};

    /**
     * 根据用户id获取用户组，返回值为数组
     * @param uid int 用户ID
     * @reutrn array
     */
Auth.prototype.getGroups = function(uid){
    var groups = []
    if( php.isset(groups[uid]) return groups[uid]

    // 从数据库取用户组
    var user_groups = getFromDb()
     groups[uid] = user_groups ? user_groups : []
     return groups[uid]
}
    /**
     * 获取用户资料，根据自己的情况读取数据库
     */
Auth.prototype.getUserInfo(uid){
    var userinfo = []
    if( !php.isset(userinfo[uid]) ){
        userinfo[uid] = getFromDb()
    }
    return userinfo[uid]
}

function is_string(obj){
    return Object.prototype.toString.call(obj) === '[object String]'
}

