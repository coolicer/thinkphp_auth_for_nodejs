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
     * 获得权限列表
     * @param integer uid 用户id
     * @param integer type
     */
Auth.getAuthList = function(uid,type){
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
    var rules = //getFromDb()

    // 循环规则，判断结果
    authList = []
    rules.forEach(function(rule){
        if( !php.empty( rule['condition']) ){  //根据condition进行验证
            var user = Auth.getUserInfo(uid) // 获取用户信息，一维数组
            
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
}
    /**
     * 获取用户资料，根据自己的情况读取数据库
     */
Auth.getUserInfo = function(uid){
    var userinfo = []
    if( !php.isset(userinfo[uid]) ){
        userinfo[uid] = // getFromDb()
    }
    return userinfo[uid]
}

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
    var authList = Auth.getAuthList(uid,type)
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
     * 根据用户id获取用户组，返回值为数组
     * @param uid int 用户ID
     * @reutrn array
     */
Auth.prototype.getGroups = function(uid){
    var groups = []
    if( php.isset(groups[uid]) return groups[uid]

    // 从数据库取用户组
    var user_groups = // getFromDb()
     groups[uid] = user_groups ? user_groups : []
     return groups[uid]
}


function is_string(obj){
    return Object.prototype.toString.call(obj) === '[object String]'
}

/**
 * 权限认证类
 * 功能特性：
 * 1，是对规则进行认证，不是对节点进行认证。用户可以把节点当作规则名称实现对节点进行认证。
 *      $auth=new Auth();  $auth->check('规则名称','用户id')
 * 2，可以同时对多条规则进行认证，并设置多条规则的关系（or或者and）
 *      $auth=new Auth();  $auth->check('规则1,规则2','用户id','and') 
 *      第三个参数为and时表示，用户需要同时具有规则1和规则2的权限。 当第三个参数为or时，表示用户值需要具备其中一个条件即可。默认为or
 * 3，一个用户可以属于多个用户组(think_auth_group_access表 定义了用户所属用户组)。我们需要设置每个用户组拥有哪些规则(think_auth_group 定义了用户组权限)
 * 
 * 4，支持规则表达式。
 *      在think_auth_rule 表中定义一条规则时，如果type为1， condition字段就可以定义规则表达式。 如定义{score}>5  and {score}<100  表示用户的分数在5-100之间时这条规则才会通过。
 */
//数据库
/*
-- ----------------------------
-- think_auth_rule，规则表，
-- id:主键，name：规则唯一标识, title：规则中文名称 status 状态：为1正常，为0禁用，condition：规则表达式，为空表示存在就验证，不为空表示按照条件验证
-- ----------------------------
 DROP TABLE IF EXISTS `think_auth_rule`;
CREATE TABLE `think_auth_rule` (  
    `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,  
    `name` char(80) NOT NULL DEFAULT '',  
    `title` char(20) NOT NULL DEFAULT '',  
    `type` tinyint(1) NOT NULL DEFAULT '1',    
    `status` tinyint(1) NOT NULL DEFAULT '1',  
    `condition` char(100) NOT NULL DEFAULT '',  # 规则附件条件,满足附加条件的规则,才认为是有效的规则
    PRIMARY KEY (`id`),  
    UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
-- ----------------------------
-- think_auth_group 用户组表， 
-- id：主键， title:用户组中文名称， rules：用户组拥有的规则id， 多个规则","隔开，status 状态：为1正常，为0禁用
-- ----------------------------
 DROP TABLE IF EXISTS `think_auth_group`;
CREATE TABLE `think_auth_group` ( 
    `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT, 
    `title` char(100) NOT NULL DEFAULT '', 
    `status` tinyint(1) NOT NULL DEFAULT '1', 
    `rules` char(80) NOT NULL DEFAULT '', 
    PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
-- ----------------------------
-- think_auth_group_access 用户组明细表
-- uid:用户id，group_id：用户组id
-- ----------------------------
DROP TABLE IF EXISTS `think_auth_group_access`;
CREATE TABLE `think_auth_group_access` (  
    `uid` mediumint(8) unsigned NOT NULL,  
    `group_id` mediumint(8) unsigned NOT NULL, 
    UNIQUE KEY `uid_group_id` (`uid`,`group_id`),  
    KEY `uid` (`uid`), 
    KEY `group_id` (`group_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
 */