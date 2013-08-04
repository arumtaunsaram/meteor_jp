---
layout: docs
title: "Meteor Kaiso - 逆引きリファレンス: Meteor プロジェクトにパッケージを追加する方法 (Atmosphere, mrt 含む)"
category: reverseref
---
## 公式パッケージ
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

参考: [APIリファレンス：コマンドライン]({{ site.url }}/apiref/commandline.html#commandline_meteor_add)

## Atmosphere

サードパーティ製のユーティリティ [Meteorite](http://oortcloud.github.io/meteorite/) を使うと [Atmosphere](https://atmosphere.meteor.com/) にて有志により作成・配布されているスマートパッケージを導入することができます。Atmosphere では Meteor アプリケーションでのページの遷移機能を提供する Router パッケージや cookie の制御を行うパッケージ等が配布されています。Meteorite (mrtコマンド) を使用するには Node.js 導入時にインストールされる npm (Node.js のパッケージ管理ツール) と git が必要です。詳しいインストール方法については [Atmosphere](https://atmosphere.meteor.com/) サイト WTF → Building an app? 内 Installation 欄をご確認下さい。

