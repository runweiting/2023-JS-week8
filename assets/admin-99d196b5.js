import{a as l,S as h}from"./sweetalert2.all-d374ba7b.js";const i={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},m="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",u=`${m}/orders`;let c=[];function p(){l.get(u,i).then(e=>{c=e.data.orders,g(c)})}p();function g(e){const a=document.querySelector("#orderItem");if(!a){console.error("找不到 #orderItem 元素");return}let o="";e.forEach(t=>{o+=`
        <tr>
        <td>${t.id}</td>
        <td>
            <p>${t.user.name}</p>
            <p>${t.user.tel}</p>
        </td>
        <td>${t.user.address}</td>
        <td>${t.user.email}</td>
        <td>
            <p>${t.products.map(n=>n.title).join("<br>")}</p>
        </td>
        <td>
            <p>${t.products.map(n=>n.quantity).join("<br>")}</p>
        </td>
        <td>${t.quantity}</td>
        <td>${new Date(t.createdAt*1e3).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${t.id}">${t.paid?"已處理":"未處理"}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${t.id}" value="刪除">
        </td>
        </tr>`}),a.innerHTML=o,document.querySelectorAll(".statusBtn").forEach(t=>{t.addEventListener("click",y)}),document.querySelectorAll(".removeBtn").forEach(t=>{t.addEventListener("click",v)}),document.querySelectorAll(".btn-warning").forEach(t=>{t.addEventListener("click",$)}),B(),E()}function y(e){e.preventDefault();const a=e.target.dataset.id;l.put(u,{data:{id:a,paid:!0}},i).then(o=>{h.fire({title:`訂單編號：${a}`,text:"已處理成功。",icon:"success"}),A(a,o.data.paid),p()})}function A(e,a){const o=document.querySelector(`.statusBtn[data-id="${e}"]`);o.textContent=a?"已處理":"未處理"}function v(e){const a=`${u}/${e.target.dataset.id}`;l.delete(a,i).then(o=>{h.fire({title:`訂單編號：${e.target.dataset.id}`,text:"已成功刪除。",icon:"success"}),p()})}function $(e){l.delete(u,i).then(a=>{h.fire({title:"全部品項",text:"已成功刪除。",icon:"success"}),p()})}function B(){let e={};c.forEach(d=>{d.products.forEach(r=>{e[r.category]==null?e[r.category]=1:e[r.category]++})});let a=Object.entries(e).map(([d,r])=>[d,r]).sort((d,r)=>r[1]-d[1]);const o=Math.max(...Object.values(e));let s=a.map(([d,r])=>r===o?"#5434A7":r>Math.floor(o/2)?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartAll",data:{columns:a,type:"pie"},pie:{title:"全產品類別營收比重"},color:{pattern:s},size:{height:350}})}function E(){let e={};c.forEach(r=>{r.products.forEach(t=>{const{title:n,quantity:f}=t;e[n]===void 0?e[n]=f:e[n]+=f})});let a=Object.entries(e).map(([r,t])=>[r,t]).sort((r,t)=>t[1]-r[1]),o=a.slice(0,3),s=a.slice(3).reduce((r,[,t])=>r+t,0);s>0&&o.push(["其他",s]);let d=o.map(([r,t],n)=>n===0?"#301E5F":n===1?"#5434A7":n===2?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartItem",data:{columns:o,type:"pie"},pie:{title:"全品項營收比重"},color:{pattern:d},size:{height:350}})}
