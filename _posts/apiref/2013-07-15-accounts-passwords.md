---
layout: docs
title: "Meteor Kaiso - APIリファレンス: パスワード"
category: apiref
ref-official: 
  - title: Documentation
    title-jp: ドキュメント
    url: htt://docs.meteor.com/#templates_api
---

## パスワード 

accounts-password パッケージにはパスワードベースの認証用のフルシステムが含まれています。基本的なユーザ名とパスワードにもとづくサインインプロセスに加え、アドレスの検証を含んだメールベースのサインインとパスワード再発行の認証もサポートしています。

他の多くのウェブアプリケーションとはことなり、Meteor のクライアントはサーバに直接パスワードを送信しません。サーバが決してユーザの平文パスワードに触れないことを確実とするため、Secure Remote Password protocol [<a href="http://en.wikipedia.org/wiki/Secure_Remote_Password_protocol">英語版 Wikipedia</a>, <a href="https://access.redhat.com/site/documentation/ja-JP/JBoss_Enterprise_Application_Platform/5/html/Security_Guide/chap-Secure_Remote_Password_Protocol.html">RedHatによる日本語記事</a>] を利用します。この機能はサーバのデータベースがもし危険に晒されたとき、パスワード漏洩の被害に対する保証を提供します。

アプリケーションにパスワードのサポートを追加するには、 `$ meteor add accounts-password` を実行してください。下記に記載する関数群を使い独自のユーザインタフェースを構築することもできますし、パスワードベースのサインインで鍵を回すユーザインタフェースを含んだ [accounts-ui パッケージ]({{ site.url }}/apiref/package-accounts-ui.html) を使うこともできます。

*   [Accounts.createUser](#accounts_createuser)
*   [Accounts.changePassword](#accounts_changepassword)
*   [Accounts.forgotPassword](#accounts_forgotpassword)
*   [Accounts.resetPassword](#accounts_resetpassword)
*   [Accounts.setPassword](#accounts_setpassword)
*   [Accounts.verifyEmail](#accounts_verifyemail)
*   [Accounts.sendResetPasswordEmail](#accounts_sendresetpasswordemail)
*   [Accounts.sendEnrollmentEmail](#accounts_sendenrollmentemail)
*   [Accounts.sendVerificationEmail](#accounts_sendverificationemail)
*   [Accounts.emailTemplates](#accounts_emailtemplates)

<dl>
  <dt>原文: <a href="http://docs.meteor.com/#accounts_passwords">http://docs.meteor.com/#accounts_passwords</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終確認 2013/12/23 (JST) - 最新バージョンが0.7.0.1 の時点での内容]</li>
    <li>[訳文の最終更新 2013/07/17 (JST) - 最新バージョンが0.6.4 の時点での内容]</li>
  </ul>
  </dd>
</dl>


---
<a name="accounts_createuser"></a>
## Accounts.createUser(options, [callback])
__どこでも__

新規ユーザを作成します。

### 引数

* **callback** 関数

    クライアントサイドのみの省略可能なコールバック。成功した場合には引数なしで、失敗した場合には単体の Error 引数とともに呼び出されます。

### Options

* **username** 文字列型

    対象ユーザに対応する一意の名前。

* **email** 文字列型

    対象ユーザのメールアドレス。

* **password** 文字列型

    対象ユーザのパスワード。これはネットワーク越しでの場合平文では送信され **ません** 。

* **profile** オブジェクト

    対象ユーザのプロフィールで、一般的には name フィールドを含みます。

クライアントサイドでは処理完了時に成功であれば、この関数は新しいユーザとしてログインを行います。サーバサイドでは新しく作成したユーザ id を返却します。

クライアントサイドではユーザが今後ふたたびログインができるために十分な情報、 password と、username あるいは email のどちらかを渡す必要があります。サーバサイドでは、オプションの中から任意のサブセットを渡すことができますが、ユーザは識別子とパスワードがない限りログインすることはできません。

サーバにてパスワードなしでアカウントを作成し、かつユーザに自身のパスワードを選択してもらうには、email オプションと共に createUser をよび、[Accounts.sendEnrollmentEmail](#accounts_sendenrollmentemail) を呼んでください。初回パスワードを設定するリンクがユーザにメールで送られます。

デフォルト設定では profile オプションは新しいユーザドキュメントに直接追加されます。この挙動をオーバライドするには、[Accounts.onCreateUser]({{ site.url }}/apiref/accouints.html#accounts_onCreateUser) をご利用ください。

この関数はパスワードを使いユーザを作成する際のみに使われます。外部サービスを使ったログインフローはこの関数は使いません。

---
<a name="accounts_changepassword"></a>
### Accounts.changePassword(oldPassword, newPassword, [callback])
__クライアントサイド__

現在のユーザのパスワードを変更します。ログイン状態で行う必要があります。

### 引数

* **oldPassword** 文字列型

    ユーザの現在のパスワード。これはネットワーク越しでの場合平文では送信され **ません** 。

* **newPassword** 文字列型

    ユーザの新しいパスワード。これはネットワーク越しでの場合平文では送信され **ません** 。

* **callback** 関数

    省略可能なコールバック。成功した場合には引数なしで、失敗した場合には単体の Error 引数とともに呼び出されます。

---
<a name="accounts_changepassword"></a>
### Accounts.forgotPassword(options, [callback])
__クライアントサイド__

パスワードを忘れましたメールをリクエストします。

### 引数

* **callback** 関数

    省略可能なコールバック。成功した場合には引数なしで、失敗した場合には単体の Error 引数とともに呼び出されます。

### Options

* **email** 文字列型 

    パスワードのリセットを行うリンクを送るメールアドレス。

サーバサイドの [Accounts.sendResetPasswordEmail](#accounts_sendresetpasswordemail) を呼び出します。パスワードリセット処理を完了させるには、ユーザがメールで受け取ったトークンを [Accounts.resetPassword](#accounts_resetpassword) に渡してください。

---
<a name="accounts_resetpassword"></a>
### Accounts.resetPassword(token, newPassword, [callback])
__クライアントサイド__

メールで受け取ったトークンを使いユーザのパスワードをリセットします。その後ユーザをログインさせます。

### 引数

* **token** 文字列型

   パスワードリセットURLに含まれるトークン。

* **newPassword** 文字列型 

    ユーザの新しいパスワード。これはネットワーク越しでの場合平文では送信されません。

* **callback** 関数

    省略可能なコールバック。成功した場合には引数なしで、失敗した場合には単体の Error 引数とともに呼び出されます。

この関数は [Accounts.sendResetPasswordEmail](#accounts_sendresetpasswordemail) と [Accouts.sendEnrollmentEmail](#accounts_sendresetpasswordemail) によって生成されたトークンを受け付けます。

---
<a name="accounts_setpassword"></a>
### Accounts.setPassword(newPassword, newPassword)
__サーバサイド__

強制的にユーザのパスワードを変更します。

### 引数

* **userId** 文字列型

    更新を行うユーザの id。

* **newPassword** 文字列型

    ユーザの新しいパスワード

---
<a name="accounts_verifyemail"></a>
### Accounts.verifyEmail(token, [callback])
__クライアントサイド__

ユーザのメールアドレスの正当性を受け入れ、その後ユーザをログインさせます。

### 引数

* **token** 文字列型

    パスワードリセットURLに含まれるトークン。

* **callback** 関数

    省略可能なコールバック。成功した場合には引数なしで、失敗した場合には単体の Error 引数とともに呼び出されます。

この関数は [Accounts.sendVerificationEmail](#accounts_sendverificationemail) によって生成されたトークンを受け付けます。ユーザのレコードの emails.verified を設定します。

---
<a name="accounts_sendresetpasswordemail"></a>
### Accounts.sendResetPasswordEmail(userId, [email])
__サーバサイド__

ユーザがパスワードをリセットすることができるリンクを含むメールを送信します。

### 引数

* **userId** 文字列型

    メールを送るユーザの ID 。

* **email** 文字列型

    省略可能。メールが送信されるユーザのアドレス。アアドレスはユーザの email リストの中に存在しなければなりません。デフォルト設定ではリストの中の最初のメールです。

このメールの中のトークンは [Accounts.resetPassword](#accounts_resetpassword) に渡されるべきです。

メールのコンテンツをカスタマイズするには、 [Accouts.emailTemplates](#accounts_emailtemplates) をご確認ください。

---
<a name="accounts_sendenrollmentemail"></a>
### Accounts.sendEnrollmentEmail(userId, [email])
__サーバサイド__

ユーザがパスワードを初期設定することができるリンクを含むメールを送信します。

### 引数

* **userId** 文字列型

    メールを送るユーザの ID 。

* **email** 文字列型

    省略可能。メールが送信されるユーザのアドレス。アドレスはユーザの email リストの中に存在しなければなりません。デフォルト設定ではリストの中の最初のメールです。


このメールの中のトークンは [Accounts.resetPassword](#accounts_resetpassword) に渡されるべきです。

メールのコンテンツをカスタマイズするには、 [Accouts.emailTemplates](#accounts_emailtemplates) をご確認ください。

---
<a name="accounts_sendverificationemail"></a>
### Accounts.sendVerificationEmail(userId, [email])
__サーバサイド__

ユーザがメールアドレスの立証に使うリンクを含むメールを送信します。

### 引数

* **userId** 文字列型

    メールを送るユーザの ID 。

* **email** 文字列型

    省略可能。メールが送信されるユーザのメールアドレス。アドレスはユーザの email リストの中に存在しなければなりません。デフォルト設定ではリストの中の最初の未立証メールです。

このメールの中のトークンは [Accounts.resetPassword](#accounts_resetpassword) に渡されるべきです。

メールのコンテンツをカスタマイズするには、 [Accouts.emailTemplates](#accounts_emailtemplates) をご確認ください。

---
<a name="accounts_emailtemplates"></a>
### Accounts.emailTemplates
__どこでも__

Accounts システムから送信するメールをカスタマイズするオプション。

sendResetPasswordEmail, sendEntollmentEmail そして sendVerificationEmail から送信されるメールを作成する際に使用されるいくつかのフィールドを持った Object です。

オブジェクトの下記のフィールドに割り当てることでオーバーライドしてください。

* from: RFC5322 の From アドレスに沿った文字列型。デフォルト設定ではメールは no-reply@meteor.com より送信されます。ユーザのメールからヘルプを求めるメールを受信したい場合、受信可能なメールアドレスを設定してください。

* siteName: アプリケーションの公開された名前。デフォルト設定ではアプリケーションのDNS名 (例: awesome.meteor.com)。

* resetPassword: 2つのフィールドを持つ Object 。

    * resetPassword.subject: ユーザのオブジェクトをとり、パスワードリセットメールの件名に相当する String を返却する関数。

    * resetPassword.text: ユーザのオブジェクトとURLをとり、パスワードリセットメールの本文に相当する String を返却する関数。

* enrollAccount: resetPassword と同様ですが、新しいアカウントのパスワードの設定用です。

* verifyEmail: resetPassword と同様ですが、メールアドレスの認証用です。

例:

~~~ javascript
Accounts.emailTemplates.siteName = "素敵なサイト";
Accounts.emailTemplates.from = "素敵なサイトの管理人 <accounts@example.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "ようこそ素敵な街へ、" + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "よりよい未来づくりに、あなたは選びだされました！" + 
     "下のリンクをクリックするだけで、アカウントが有効になります。"
     + url;
};
~~~
