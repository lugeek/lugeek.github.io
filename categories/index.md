---
title: 目录
layout: default
---

<div id="pages">
    {% for cat in site.categories %}
        <div class="one-item">
            <div class="item-name">
                {{ cat[0] }}
                <span class="badge">{{ cat[1].size }}</span>
            </div>
            <div class="item-content">
                <div class="row">
                    {% for post in cat[1] %}
                        <div class="item-article col-xs-12 col-sm-6 col-md-4 col-lg-4">
                            <div class="item-content-time">
                                {{ post.date | date:"%Y/%m/%d" }}
                            </div>
                            <div class="item-content-title">
                                <a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
                            </div>
                        </div>
                    {% endfor %}
                </div>
            </div>
        </div>
    {% endfor %}
</div>