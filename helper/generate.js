module.exports.generate_token=(length)=>{
  //edit the token allowed characters
  var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
  var b = [];  
  for (var i=0; i<length; i++) {
      var j = (Math.random() * (a.length-1)).toFixed(0);
      b[i] = a[j];
  }
  return b.join("");
}
module.exports.generate_Otp=(length)=>{
  const s ="0123456789";
  let result="";
  for(var i=0;i<length;i++){
    result+=s[(Math.random()*(s.length-1)).toFixed(0)]
  }
  return result;
}