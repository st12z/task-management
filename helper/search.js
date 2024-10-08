module.exports=(query)=>{
  let objectSearch={
    keyword:"",
    regex:""
  }
  if(query.keyword){
    const regex=new RegExp(query.keyword,'i');
    objectSearch.keyword=query.keyword;
    objectSearch.regex=regex;
  }
  return objectSearch;
}