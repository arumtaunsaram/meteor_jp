---
layout: docs
title: "Meteor Kaiso - リファレンス: account-ui パッケージ"
category: apiref
ref-official: 
  - title: Documentation
    title-jp: ドキュメント
    url: htt://docs.meteor.com/#accountsui
---

## accounts-ui パッケージ

<dl>
  <dt>原文: <a href="http://docs.meteor.com/#accountsui">http://docs.meteor.com/#accountsui</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終確認 2013/12/23 (JST) - 最新バージョンが0.7.0.1 の時点での内容]</li>
    <li>[訳文の最終更新 2013/07/15 (JST) - 最新バージョンが0.6.4 の時点での内容]</li>
  </ul>
  </dd>
</dl>

Meteor Accounts の鍵をまわすユーザインターフェイス。

Accounts とログインインターフェイスをアプリケーション追加するには、accounts-ui パッケージと少なくとも次のうち1つのログインプロパイダパッケージを追加してください。
accounts-password, accounts-facebook, accounts-github, accounts-google, accounts-twitter もしくは accounts-weibo 。

その後はHTMLファイルにただ \{\{loginButtons\}\} ヘルパを追加するだけです。ページのこの場所にログインウィジェットが配置されます。もし設定されたプロバイダが1つだけで、それが外部サービスの場合は、ログイン/ログアウトボタンが追加されます。もし accounts-password もしくは複数の外部のログインサービスが設定された場合、ログインオプションをドロップダウンで開く「サインイン」リンクが追加されます。もしログインドロップダウンを画面の右端に置く場合はドロップダウンが画面の右端に飛び出してしまわぬよう、 \{\{loginButtons align="right"\}\} を使ってください。

\{\{loginButtons\}\} の挙動を設定するには、 [Accounts.ui.config]({{ site.url }}/apiref/accounts.html#accounts_ui_config) をご利用ください。

accounts-ui はまた sendResetPasswordEmail, sendVerificationEmail そして sendEnrollmentEmail からのリンクを操作するモーダルなポップアップダイアログを含んでいます。これらは手動でHTMLの中に配置する必要はなく、URLが読み込まれた際に自動的に有効化されます。
