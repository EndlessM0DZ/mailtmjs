let axios = require('axios')
const base_url =  `https://api.mail.tm`
async function token(address, password){
    let data = {
        address: address,
        password: password
    }
    return await req('post', '/token', null, data)
}
async function domains(id){
    if(arguments.length == 0){
        return await req('get', '/domains', null, null)
    }
    else{
        return await req('get', `/domains/${id}`, null, null)
    }
}
async function create_account(address, password){
    let data = {
        address: address,
        password: password
    }
    return await req('post', '/accounts', null, data)
}
async function account_info(bearer, id){
    return await req('get', `/accounts/${id}`, bearerHeader(bearer))
}
async function delete_account(bearer, id){
    return await req('delete', `/accounts/${id}`, bearerHeader(bearer))
}
async function get_me(bearer){
    return await req('get', '/me', bearerHeader(bearer))
}
async function messages_on_page(bearer, page){
    return await req('get', `/messages?page=${page}`, bearerHeader(bearer))
}
async function get_all_messages(bearer){
    let messages = []
    for(let i = 1; i < Number.MAX_SAFE_INTEGER; i++){
        let res = await messages_on_page(bearer, i)
        if(res.success){
            if(res.data['hydra:member'].length == 0){
                break
            }
            else{
                messages.push(...res.data['hydra:member'])
            }
        }
        else{
            break
        }
        if(i % 8 === 0) await pause(1000)
    }
    return messages
}
function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
async function get_message(bearer, id){
    return await req('get', `/messages/${id}`, bearerHeader(bearer))
}
async function delete_message(bearer, id){
    return await req('delete', `/messages/${id}`, bearerHeader(bearer))
}
async function mark_message_read(bearer, id){
    return await req('patch', `/messages/${id}`, bearerHeader(bearer))
}
async function get_source(bearer, id){
    return await req('get', `/sources/${id}`, bearerHeader(bearer))
}
function bearerHeader(bearer){
    return {"Authorization":`Bearer ${bearer}`}
}
function configManager(config){
    if(config.headers == '' || config.headers == null || config.headers == undefined) delete config.headers
    if(config.data == '' || config.data == null || config.data == undefined) delete config.data
}
async function req(method, path, headers, data){
    return new Promise((resolve)=>{
        let config = {
            method: method,
            url: base_url + path,
            headers: headers,
            data: data
        };
        configManager(config)
        axios(config)
        .then(function(response){
            response['success'] = true
            resolve(response)
        })
        .catch(function(response){
            response['success'] = false
            resolve(response)
        })
    })
}
module.exports = {
    create_account,
    account_info,
    delete_account,
    token,
    domains,
    get_me,
    messages_on_page,
    get_message,
    delete_message,
    mark_message_read,
    get_source,
    get_all_messages
}
