---
permalink: /sapers/
layout: page
date: 2026-01-20
---

<h1>Directorio del SAP Team</h1>

<div class="usuarios-grid">
  {% for usuario in site.usuarios %}
    {% assign user_data = site.data[usuario.datafile] %}
    {% if user_data.user %}
      {% assign user = user_data.user %}
    {% elsif user_data.users %}
      {% assign user = user_data.users[0] %}
    {% else %}
      {% assign user = nil %}
    {% endif %}

    <a href="{{ usuario.url | relative_url }}" title="Usuario SAP {{ usuario.title }}" class="usuario-card">
      {% if user and user.avatar_template %}
        <img src="{% if user.avatar_template contains 'http' %}{{ user.avatar_template }}{% else %}https://foros.consultoria-sap.com{{ user.avatar_template }}{% endif %}" alt="Avatar {{ usuario.title }}" />
      {% endif %}
      <div class="usuario-nombre">{{ usuario.title }}</div>
      {% if usuario.tags %}
        <div class="usuario-tags">
          {% for tag in usuario.tags %}
            <span>{{ tag }}</span>
          {% endfor %}
        </div>
      {% endif %}
    </a>
  {% endfor %}
</div>
