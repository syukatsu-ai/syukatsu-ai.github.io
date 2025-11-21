(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=s(e);fetch(e.href,o)}})();const c=document.getElementById("project-grid"),a=t=>{const r=document.createElement("div");r.className="project-card";let s=[];Array.isArray(t.tags)?s=t.tags:typeof t.tags=="string"&&(s=t.tags.split(",").map(e=>e.trim()));const n=s.map(e=>`<span class="tag">${e}</span>`).join("");return r.innerHTML=`
    <a href="${t.link}" target="_blank" rel="noopener noreferrer" style="display: block;">
      <img src="${t.image}" alt="${t.title}" class="project-image">
      <div class="project-info">
        <h3 class="project-title">${t.title}</h3>
        <p class="project-desc">${t.description}</p>
        <div class="project-tags">
          ${n}
        </div>
      </div>
    </a>
  `,r},l=async()=>{if(c)try{const t=await fetch("projects.json");if(!t.ok)throw new Error("Failed to load projects");const r=await t.json();c.innerHTML="",r.forEach(s=>{const n=a(s);c.appendChild(n)})}catch(t){console.error("Error loading projects:",t),c.innerHTML="<p>Failed to load projects.</p>"}};document.addEventListener("DOMContentLoaded",()=>{l(),document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",function(r){r.preventDefault(),document.querySelector(this.getAttribute("href")).scrollIntoView({behavior:"smooth"})})})});
