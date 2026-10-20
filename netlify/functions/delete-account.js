// Netlify server function. Keep SUPABASE_SERVICE_ROLE_KEY only in Netlify environment variables.
exports.handler=async (event)=>{
  if(event.httpMethod!=='POST')return {statusCode:405,headers:{Allow:'POST'},body:JSON.stringify({error:'Method not allowed'})};
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return {statusCode:503,body:JSON.stringify({error:'Account deletion is not configured. Contact support.'})};
  const token=/^Bearer\s+(.+)$/i.exec(event.headers.authorization||event.headers.Authorization||'')?.[1];
  if(!token)return {statusCode:401,body:JSON.stringify({error:'Sign in again before deleting your account.'})};
  let request;try{request=JSON.parse(event.body||'{}')}catch{return {statusCode:400,body:JSON.stringify({error:'Invalid request'})}}
  if(request.confirmation!=='DELETE')return {statusCode:400,body:JSON.stringify({error:'Deletion confirmation required'})};
  const base=url.replace(/\/$/,'');
  try{
    // Authenticate the caller with their own JWT; never trust a user ID from the request.
    const verify=await fetch(base+'/auth/v1/user',{headers:{apikey:key,Authorization:'Bearer '+token}});
    if(!verify.ok)return {statusCode:401,body:JSON.stringify({error:'Session expired. Please sign in again.'})};
    const user=await verify.json();
    if(!user.id)return {statusCode:401,body:JSON.stringify({error:'Invalid account session'})};
    // Foreign-key ON DELETE CASCADE removes the associated gift_studio_planners row.
    const deleted=await fetch(base+'/auth/v1/admin/users/'+encodeURIComponent(user.id),{method:'DELETE',headers:{apikey:key,Authorization:'Bearer '+key}});
    if(!deleted.ok)return {statusCode:502,body:JSON.stringify({error:'Unable to delete your account right now. Contact support.'})};
    return {statusCode:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:JSON.stringify({deleted:true})};
  }catch{return {statusCode:502,body:JSON.stringify({error:'Account service unavailable. Please try again later.'})}}
};
