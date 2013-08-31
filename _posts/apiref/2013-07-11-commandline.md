---
layout: docs
title: "Meteor Kaiso - APIリファレンス: コマンドライン"
category: apiref
ref-official: 
  - title: Documentation
    title-jp: ドキュメント
    url: htt://docs.meteor.com/#commandline
---

## コマンドライン

<dl>
  <dt>原文: <a href="http://docs.meteor.com/#commandline">http://docs.meteor.com/#commandline</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終確認 2013/08/21 (JST) - 最新バージョンが0.6.5.1 の時点での内容]</li>
    <li>[訳文の最終更新 2013/07/14 (JST) - 最新バージョンが0.6.4 の時点での内容]</li>
  </ul>
  </dd>
</dl>


---
<a name="commandline_meteor_help"></a>
### meteor help

Meteor のコマンドラインの使用方法に関するヘルプを表示します。meteor help を実行すると一般的な meteor のコマンドのリストを表示します。meteor help _command_ はそのコマンドについての詳細を表示します。

---
<a name="commandline_meteor_run"></a>
### meteor run

カレントディレクトリのプロジェクトの Meteor 開発用サーバを起動します。

---
<a name="commandline_meteor_create"></a>
### meteor create _プロジェクト名_

新しい Meteor プロジェクトを作成します。 _プロジェクト名_ が名付けられたディレクトリを作成しテンプレートアプリケーションをコピーします。絶対パスでも、相対パスでも指定することができます。

---
<a name="commandline_meteor_deploy"></a>
### meteor deploy _サイト名_

カレントディレクトリのプロジェクトを Meteor サーバにデプロイします。

追加設定必要なしに、たとえば、myapp.meteor.com の様な meteor.com の下の利用可能な名前ならいずれでもデプロイできます。myapp.mydomain.com の様な独自ドメインにデプロイしたい場合、そのドメインの DNS が origin.meteor.com に向いているか確認しなければなりません。

--debug を指定するとデバッグモードでデプロイすることができます。ローカルの開発モードの様に、ソースコードがブラウザのデバッガで可読可能な状態とします。

デプロイしたアプリケーションを削除するには、サイト名にくわえ --delete オプションを指定してください。

デプロイに対して管理者のパスワードを追加する場合、--password オプションを含めてください。Meteor はパスワードを要求します。一度設定すると、 同じドメインに対する meteor deploy はそれ以降パスワードを求めます。このパスワードは meteor mongo と meteor logs へのアクセスを保護します。meteor deploy --password で最初に設定したパスワードを与えることで新しいパスワードを設定することができます。

<strong>パスワードによる保護は管理に対しての挙動にのみ有効で、ウェブサイトへのアクセスを制御するわけではありまあせん。かつ、これは Meteor 開発チームが Meteor のアカウント機能を完全に開発するまでの暫定的なハックです。</strong>

<strong>meteor.com 以外のドメイン名を利用する場合、ドメイン名が origin.meteor.com に向いているか確認してください。myapp.com の様なトップレベルのドメインが必要な場合、 DNS の A レコードを origin.meteor.com のIPアドレスに合致させる必要があります。</strong>

--settings オプションを使いアプリケーションのデプロイ時に特定の情報を追加することができます。--settings の引数は JSON 文字列が記載されたファイルです。設定 (setting) ファイル内のオブジェクトはアプリケーションのサーバサイドにて Meteor.settings の形式で参照することができます。

設定 (setting) は永続します。アプリケーションを再デプロイした際、古い値は --settings オプションを使い明示的に新しい設定を渡さない限り継承されます。 Meteor.settings を解除するには、空の設定ファイルを渡してください。

---
<a name="commandline_meteor_logs"></a>
### meteor logs _サイト名_

名前で Meteor アプリケーションを指定しサーバのログを取得します。

Meteor は サーバコードの console.log() の出力をログサーバへとリダイレクトします。meteor log はそれらのログを表示します。クライアントのコードの console.log() の出力は、ほかのクライアントサイドの JavaScript と同様にブラウザの検証ツールより利用可能です。

---
<a name="commandline_meteor_update"></a>
### meteor update

カレントディレクトリのプロジェクトで使う Meteor のバージョンを設定します。--release を使いバージョン (リリース名) が指定された場合、プロジェクトがそのバージョンを使うように設定されます。そうでない場合は最新の Meteor のリリースをダウンロードし設定します。

<!-- パッケージ開発に関わる話のため保留
すべてのプロジェクトは Meteor の特定のリリースに紐付けられています。--release オプションを
-->

---
<a name="commandline_meteor_add"></a>
### meteor add _パッケージ名_

パッケージを Meteor プロジェクトに追加します。一つのコマンドで複数のパッケージを追加することができます。利用可能なパッケージは meteor list を実行すると確認できます。

---
<a name="commandline_meteor_remove"></a>
### meteor remove _パッケージ名_

一度 Meteor プロジェクトに追加したパッケージを削除します。アプリケーションが現在利用しているパッケージのリストは meteor list --using を実行すると確認できます。

---
<a name="commandline_meteor_list"></a>
### meteor list

引数なしの場合、すべての利用可能な Meteor のパッケージをリストします。リストされたパッケージをプロジェクトに追加するには meteor add _package_ を実行してください。

--using を利用すると、プロジェクトに既に追加されているパッケージをリストします。

---
<a name="commandline_meteor_mongo"></a>
### meteor mongo

ローカルの開発用データベースの MongoDB シェルを開きます。直接の閲覧と操作が可能となります。

<strong>現状、事前に meteor run を使いアプリケーションをローカルで実行している必要があります。将来的にはさらに簡単になる予定です。</strong>

---
<a name="commandline_meteor_reset"></a>
### meteor reset

カレントのプロジェクトをまっさらな状態にリセットします。ローカルの mongo データベースを削除します。

<strong>このコマンドはデータを削除します！meteor mongo コマンドを実行し重要なデータが mongo データベースに登録されていないか確認してください。mongo シェルでは show collections と db.collection.find() を使いデータを確認してください。</strong>
<strong>現状、開発サーバが実行されている状態ではこのコマンドは実行できません。実行する前にすべての Meteor アプリケーションを停止してください。 </strong>

---
<a name="commandline_meteor_bundle"></a>
### meteor bundle

デプロイに向けアプリケーションをパッケージ化します。アプリケーション実行に必要なすべてを含む tarball を出力します。詳細については tarball の 中のREADME をご確認ください。

Meteor のサーバではなく、独自のサーバで Meteor アプリケーションを提供する場合に使用することができます。meteor deploy を使った場合に運用代行されるロギング, モニタリング, バックアップ, ロードバランシングなどは自前で用意する必要があります。
