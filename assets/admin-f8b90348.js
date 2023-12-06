import{a as l,S as f}from"./sweetalert2.all-e4d32059.js";const i={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},g="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",u=`${g}/orders`;let c=[];function p(){l.get(u,i).then(t=>{c=t.data.orders,m(c),B(),D()})}p();function m(t){const r=document.querySelector("#orderItem");if(!r){console.error("找不到 #orderItem 元素");return}let a="";t.forEach(e=>{a+=`
        <tr>
        <td>${e.id}</td>
        <td>
            <p>${e.user.name}</p>
            <p>${e.user.tel}</p>
        </td>
        <td>${e.user.address}</td>
        <td>${e.user.email}</td>
        <td>
            <p>${e.products.map(o=>o.title).join("<br>")}</p>
        </td>
        <td>
            <p>${e.products.map(o=>o.quantity).join("<br>")}</p>
        </td>
        <td>${e.quantity}</td>
        <td>${new Date(e.createdAt*1e3).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${e.id}">${e.paid?"已處理":"未處理"}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${e.id}" value="刪除">
        </td>
        </tr>`}),r.innerHTML=a}const A=document.querySelector(".orderTable");A.addEventListener("click",t=>{t.preventDefault();let r=t.target.getAttribute("class");const a=t.target.getAttribute("data-id");r=="statusBtn"&&$(a),r=="removeBtn"&&y(a),t.target.dataset.btn=="removeAllBtn"&&b()});function $(t){l.put(u,{data:{id:t,paid:!0}},i).then(r=>{f.fire({title:`訂單編號：${t}`,text:"已處理成功。",icon:"success"}),v(t,r.data.paid),p()})}function v(t,r){const a=document.querySelector(`.statusBtn[data-id="${t}"]`);a.textContent=r?"已處理":"未處理"}function y(t){const r=`${u}/${t}`;l.delete(r,i).then(a=>{f.fire({title:`訂單編號：${t}`,text:"已成功刪除。",icon:"success"}),p()})}function b(){l.delete(u,i).then(t=>{f.fire({title:"全部品項",text:"已成功刪除。",icon:"success"}),p()})}function B(){let t={};c.forEach(e=>{e.products.forEach(o=>{t[o.category]==null?t[o.category]=1:t[o.category]++})});let r=Object.entries(t).map(([e,o])=>[e,o]).sort((e,o)=>o[1]-e[1]),a=r.map(([e,o],n)=>n===0?"#5434A7":n===1?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartAll",data:{columns:r,type:"pie"},pie:{title:"全產品類別營收比重"},color:{pattern:a},size:{height:350}})}function D(){let t={};c.forEach(n=>{n.products.forEach(s=>{const{title:d,quantity:h}=s;t[d]===void 0?t[d]=h:t[d]+=h})});let r=Object.entries(t).map(([n,s])=>[n,s]).sort((n,s)=>s[1]-n[1]),a=r.slice(0,3),e=r.slice(3).reduce((n,[,s])=>n+s,0);e>0&&a.push(["其他",e]);let o=a.map(([n,s],d)=>d===0?"#301E5F":d===1?"#5434A7":d===2?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartItem",data:{columns:a,type:"pie"},pie:{title:"全品項營收比重"},color:{pattern:o},size:{height:350}})}
