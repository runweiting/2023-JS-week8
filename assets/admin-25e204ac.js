import{a as l,S as f}from"./sweetalert2.all-e4d32059.js";const i={headers:{Authorization:"CXLvMgR3dAaogAeoJqJ2IhKaL4P2"}},h="https://livejs-api.hexschool.io/api/livejs/v1/admin/runweiting",u=`${h}/orders`;let d=[];function p(){l.get(u,i).then(t=>{d=t.data.orders,g(d),b(),B()})}p();function g(t){const a=document.querySelector("#orderItem");if(!a){console.error("找不到 #orderItem 元素");return}let n="";t.forEach(e=>{n+=`
        <tr>
        <td>${e.id}</td>
        <td>
            <p>${e.user.name}</p>
            <p>${e.user.tel}</p>
        </td>
        <td>${e.user.address}</td>
        <td>${e.user.email}</td>
        <td>
            <p>${e.products.map(r=>r.title).join("<br>")}</p>
        </td>
        <td>
            <p>${e.products.map(r=>r.quantity).join("<br>")}</p>
        </td>
        <td>${e.quantity}</td>
        <td>${new Date(e.createdAt*1e3).toLocaleDateString()}</td>
        <td class="orderStatus">
            <a href="#" class="statusBtn" data-id="${e.id}">${e.paid?"已處理":"未處理"}</a>
        </td>
        <td>
            <input type="button" class="removeBtn" data-id="${e.id}" value="刪除">
        </td>
        </tr>`}),a.innerHTML=n}const m=document.querySelector(".orderTable");m.addEventListener("click",t=>{t.preventDefault();let a=t.target.getAttribute("class");const n=t.target.getAttribute("data-id");a=="statusBtn"&&A(n),a=="removeBtn"&&$(n),t.target.dataset.btn=="removeAllBtn"&&v()});function A(t){l.put(u,{data:{id:t,paid:!0}},i).then(a=>{f.fire({title:`訂單編號：${t}`,text:"已處理成功。",icon:"success"}),y(t,a.data.paid),p()})}function y(t,a){const n=document.querySelector(`.statusBtn[data-id="${t}"]`);n.textContent=a?"已處理":"未處理"}function $(t){const a=`${u}/${t}`;l.delete(a,i).then(n=>{f.fire({title:`訂單編號：${t}`,text:"已成功刪除。",icon:"success"}),p()})}function v(){l.delete(u,i).then(t=>{f.fire({title:"全部品項",text:"已成功刪除。",icon:"success"}),p()})}function b(){let t={};d.forEach(e=>{e.products.forEach(r=>{t[r.category]==null?t[r.category]=r.price*r.quantity:t[r.category]+=r.price*r.quantity})});let a=Object.entries(t).map(([e,r])=>[e,r]).sort((e,r)=>r[1]-e[1]),n=a.map(([e,r],o)=>o===0?"#5434A7":o===1?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartAll",data:{columns:a,type:"pie"},pie:{title:"全產品類別營收比重"},color:{pattern:n},size:{height:350}})}function B(){let t={};d.forEach(o=>{o.products.forEach(s=>{const{title:c,quantity:D}=s;console.log(s),t[c]===void 0?t[c]=s.price:t[c]+=s.price})});let a=Object.entries(t).map(([o,s])=>[o,s]).sort((o,s)=>s[1]-o[1]),n=a.slice(0,3),e=a.slice(3).reduce((o,[,s])=>o+s,0);e>0&&n.push(["其他",e]);let r=n.map(([o,s],c)=>c===0?"#301E5F":c===1?"#5434A7":c===2?"#9D7FEA":"#DACBFF");c3.generate({bindto:".chartItem",data:{columns:n,type:"pie"},pie:{title:"全品項營收比重"},color:{pattern:r},size:{height:350}})}
