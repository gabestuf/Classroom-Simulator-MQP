const STORYEVENTS = require("./ObjectJSON.json"); 



for(let i=0; i< STORYEVENTS.length; i++ )
{

    let key = Object.keys(STORYEVENTS[i])[0];

    setTimeout (function timer() {
//let key = objKeys[i];
     
      let charInvolve = STORYEVENTS[i][key]['charactersInvolved'];
      //console.log(key);
      console.log(charInvolve);
      charInvolve.forEach(eachChar => {
        let descsArray  = STORYEVENTS[i][key][eachChar]['description'];

        // descsArray.forEach(eachDesc => {
             console.log(descsArray);
        // })

      });

      }, i* 1000);

}


