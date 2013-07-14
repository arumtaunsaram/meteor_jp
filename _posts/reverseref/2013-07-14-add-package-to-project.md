---
layout: docs
title: "Meteor Kaiso - 逆引きリファレンス: Meteor プロジェクトにパッケージを追加する方法"
category: reverseref
---

[最終内容確認 2013/07/14 (JST) - 最新バージョンが0.6.3.1 の時点での内容]

カレントディレクトリのプロジェクトにパッケージを追加するには、`meteor add パッケージ名` コマンドを利用します。現在プロジェクトに設定されているパッケージの一覧は `meteor list --using` コマンドを使い確認することができます。

~~~ javascript
$ meteor add jquery
jquery: Manipulate the DOM using CSS selectors
$ meteor list --using
autopublish
insecure
preserve-inputs
random
jquery
~~~

[APIリファレンス：コマンドライン]({{ site.url }}/apiref/commandline.html#commandline_meteor_add)
