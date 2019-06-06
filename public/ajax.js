
fetch("/getPagination", {
    method: "post",
    headers: new Headers({
        'Content-Type': "application/json"
    })
})
.then((res) => {
    return res.json();
})
.then((resultJson) => {
        const current = resultJson.current;
        const pages = resultJson.pages;



        
//  if (pages && pages > 0) { 
    
//      if (current == 1) { 
//         document.getElementById("nav-first-disabled").innerHTML = '<li class="page-item disabled"><a class="page-link">First</a></li>'; 
//      } else { 
//         document.getElementById("nav-first").innerHTML = '<li><a class="page-link" href="/">First</a></li>';
//      } 

//      if (current == 1) { 
//         document.getElementById("nav-arrowLeft-disabled").innerHTML = '<li class="page-item disabled"><a class="page-link">«</a></li> ';
//      } else { 
//         document.getElementById("nav-arrowLeft").innerHTML = `<li><a class="page-link" href="/?page= ${ Number(current) - 1}">«</a></li>`;
//      } 

//      var i = (Number(current) > 5 ? Number(current) - 4 : 1);
//      if (i !== 1) { 
//         document.getElementById("nav-leftdot-disabled").innerHTML = ' <li class="page-item disabled"><a class="page-link">...</a></li> ';
//      } 
//      for (; i <= (Number(current) + 4) && i <= pages; i++) { 
//          if (i == current) { 																			
//             document.getElementById("nav-current-page").innerHTML += ` <li class="active"><a class="page-link">${i}</a></li>`;
//          } else { 																																
//             document.getElementById("nav-link").innerHTML += ` <li><a class="page-link" href="/?page=${i}"></a></li> `;
//         } 																						
//         if (i == Number(current) + 4 && i < pages) { 											
//             document.getElementById("nav-rightdot-disabled").innerHTML += ' <li class="page-item disabled"><a class="page-link">...</a></li> ';					
//         } 
//     }  																											

//      if (current == pages) { 					
//         document.getElementById("nav-arrowRight-disabled").innerHTML = ' <li class="page-item disabled"><a class="page-link">»</a></li> ';
//     } else { 
//         document.getElementById("nav-arrowRight").innerHTML = ` <li><a class="page-link" href="/?page=${ Number(current) + 1 }">»</a></li> `;
//     } 

//      if (current == pages) { 
//         document.getElementById("nav-last-disabled").innerHTML = '  <li class="page-item disabled"><a class="page-link">Last</a></li> ';
//     } else { 
//         document.getElementById("nav-last").innerHTML = `<li><a class="page-link" href="/?page= ${ pages }">Last</a></li>`;
//     } 
     

 //} 

}); //fetch 끝