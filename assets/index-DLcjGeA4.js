(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const i=document.getElementById("project-grid"),a=e=>{const r=document.createElement("div");r.className="project-card";let s=[];Array.isArray(e.tags)?s=e.tags:typeof e.tags=="string"&&(s=e.tags.split(",").map(t=>t.trim()));const n=s.map(t=>`<span class="tag">${t}</span>`).join("");return r.innerHTML=`
    <a href="${e.link}" target="_blank" rel="noopener noreferrer" style="display: block;">
      <img src="${e.image}" alt="${e.title}" class="project-image">
      <div class="project-info">
        <h3 class="project-title">${e.title}</h3>
        <p class="project-desc">${e.description}</p>
        <div class="project-tags">
          ${n}
        </div>
      </div>
    </a>
  `,r},l=async()=>{if(i)try{const e=await fetch("projects.json");if(!e.ok)throw new Error("Failed to load projects");const r=await e.json();i.innerHTML="",r.forEach(s=>{const n=a(s);i.appendChild(n)})}catch(e){console.error("Error loading projects:",e),i.innerHTML="<p>Failed to load projects.</p>"}};document.addEventListener("DOMContentLoaded",()=>{l(),fetch("settings.json").then(e=>e.json()).then(e=>{if(e.noteId){const r=document.getElementById("site-title");r&&(r.textContent=e.noteId)}}).catch(e=>console.error("Failed to load settings",e)),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(r){r.preventDefault(),document.querySelector(this.getAttribute("href")).scrollIntoView({behavior:"smooth"})})})});
