---
title: 归档
layout: default
---

<div id="pages">
    {% for post in site.posts %}
        
                {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
                {% if year != y %}
                    {% assign year = y %}
                    <div class="one-item">
                        <div class="item-name">
                        {{ y }}
                        </div>
                        <div class="item-content">
                            <div class="row">
                                {% for post2 in site.posts %}
                                    {% capture y2 %}{{post2.date | date:"%Y"}}{% endcapture %}
                                    {% if y2 == y %}
                                        <div class="item-article col-xs-12 col-sm-6 col-md-4 col-lg-4">
                                            <div class="item-content-time">
                                                {{ post2.date | date:"%Y/%m/%d" }}
                                            </div>
                                            <div class="item-content-title">
                                                <a href="{{ site.url }}{{ post2.url }}">{{ post2.title }}</a>
                                            </div>
                                        </div>
                                    {% endif %}
                                {% endfor %}
                             </div>
                         </div>
                     </div>
                {% endif %}
           
    {% endfor %}
</div>