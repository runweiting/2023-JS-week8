import{a as l,S as h}from"./sweetalert2.all-e4d32059.js";const i={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},m="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",u=`${m}/orders`;let c=[];function p(){l.get(u,i).then(t=>{c=t.data.orders,g(c),B(),O()})}p();function g(t){const a=document.querySelector("#orderItem");if(!a){console.error("找不到 #orderItem 元素");return}let o="";t.forEach(r=>{o+=`
        <tr>
        <td>${r.id}</td>
        <td>
            <p>${r.user.name}</p>
            <p>${r.user.tel}</p>
        </td>
        <td>${r.user.address}</td>
        <td>${r.user.email}</td>
        <td>
            <p>${r.products.map(n=>n.title).join("<br>")}</p>
        </td>
        <td>
            <p>${r.products.map(n=>n.quantity).join("<br>")}</p>
        </td>
        <td>${r.quantity}</td>
        <td>${new Date(r.createdAt*1e3).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${r.id}">${r.paid?"已處理":"未處理"}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${r.id}" value="刪除">
        </td>
        </tr>`}),a.innerHTML=o}const A=document.querySelector(".orderTable");A.addEventListener("click",t=>{t.preventDefault();let a=t.target.getAttribute("class");const o=t.target.getAttribute("data-id");a=="statusBtn"&&$(o),a=="removeBtn"&&v(o),t.target.dataset.btn=="removeAllBtn"&&b()});function $(t){l.put(u,{data:{id:t,paid:!0}},i).then(a=>{h.fire({title:`訂單編號：${t}`,text:"已處理成功。",icon:"success"}),y(t,a.data.paid),p()})}function y(t,a){const o=document.querySelector(`.statusBtn[data-id="${t}"]`);o.textContent=a?"已處理":"未處理"}function v(t){const a=`${u}/${t}`;l.delete(a,i).then(o=>{h.fire({title:`訂單編號：${t}`,text:"已成功刪除。",icon:"success"}),p()})}function b(){l.delete(u,i).then(t=>{h.fire({title:"全部品項",text:"已成功刪除。",icon:"success"}),p()})}function B(){let t={};c.forEach(n=>{n.products.forEach(e=>{t[e.category]==null?t[e.category]=1:t[e.category]++})});let a=Object.entries(t).map(([n,e])=>[n,e]).sort((n,e)=>e[1]-n[1]);const o=Math.max(...Object.values(t));let r=a.map(([n,e])=>e===o?"#5434A7":e>Math.floor(o/2)?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartAll",data:{columns:a,type:"pie"},pie:{title:"全產品類別營收比重"},color:{pattern:r},size:{height:350}})}function O(){let t={};c.forEach(e=>{e.products.forEach(s=>{const{title:d,quantity:f}=s;t[d]===void 0?t[d]=f:t[d]+=f})});let a=Object.entries(t).map(([e,s])=>[e,s]).sort((e,s)=>s[1]-e[1]),o=a.slice(0,3),r=a.slice(3).reduce((e,[,s])=>e+s,0);r>0&&o.push(["其他",r]);let n=o.map(([e,s],d)=>d===0?"#301E5F":d===1?"#5434A7":d===2?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartItem",data:{columns:o,type:"pie"},pie:{title:"全品項營收比重"},color:{pattern:n},size:{height:350}})}
