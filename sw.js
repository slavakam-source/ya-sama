/* Офлайн-режим: складываем всё в кэш при установке и отдаём из него. */
var CACHE = 'ya-sama-v1';
var ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "img/acc-backpack.jpg",
  "img/acc-bow.jpg",
  "img/acc-crown.jpg",
  "img/acc-glasses.jpg",
  "img/acc-headphones.jpg",
  "img/acc-wand.jpg",
  "img/avatar.jpg",
  "img/outfit-ballet.jpg",
  "img/outfit-princess.jpg",
  "img/outfit-space.jpg",
  "img/outfit-sport.jpg",
  "img/outfit-unicorn.jpg",
  "img/reward-aquapark.jpg",
  "img/reward-book.jpg",
  "img/reward-cinema.jpg",
  "img/reward-craft.jpg",
  "img/reward-icecream.jpg",
  "img/reward-karting.jpg",
  "img/reward-park.jpg",
  "img/reward-pizza.jpg",
  "img/reward-playroom.jpg",
  "img/reward-tablet.jpg",
  "img/reward-toy.jpg",
  "img/reward-tv.jpg",
  "img/reward-walk.jpg",
  "img/reward-zoo.jpg",
  "img/room.jpg",
  "img/scene-awards.jpg",
  "img/scene-parent.jpg",
  "img/scene-shop.jpg",
  "img/scene-tasks.jpg",
  "img/task-backpack.jpg",
  "img/task-bed.jpg",
  "img/task-clothes.jpg",
  "img/task-dishes.jpg",
  "img/task-exercise.jpg",
  "img/task-homework.jpg",
  "img/task-piano.jpg",
  "img/task-plants.jpg",
  "img/task-read.jpg",
  "img/task-shower.jpg",
  "img/task-table.jpg",
  "img/task-teeth.jpg",
  "img/task-toys.jpg",
  "img/task-trash.jpg"
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    /* по одному, чтобы одна неудача не сорвала установку целиком */
    return Promise.all(ASSETS.map(function(u){
      return c.add(new Request(u, {cache:'reload'})).catch(function(){});
    }));
  }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});

self.addEventListener('fetch', function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        if(res && res.status===200 && res.type==='basic'){
          var copy=res.clone();
          caches.open(CACHE).then(function(c){c.put(e.request, copy)});
        }
        return res;
      }).catch(function(){
        return caches.match('index.html');
      });
    })
  );
});
