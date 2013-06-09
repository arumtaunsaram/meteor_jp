<article class="solidArticle" id="solidArticle_concept">
<h2>設計概念</h2>
<ul>
  <li><a href="#structuring_your_app">アプリケーションの組み立て</a></li>
  <li><a href="#data_and_security">データとセキュリティ</a></li>
  <ul>
    <li><a href="#data_and_security-authentication_and_user_accounts">認証とユーザアカウント</a></li>
    <li><a href="#data_and_security-input_validation">入力データのバリデーション処理</a></li>
  </ul>
  <li><!-- a href="#reactivity" -->レスポンス速度<!-- /a --></li>
  <li><!-- a href="#live_html" -->Live HTML<!-- /a --></li>
  <li><!-- a href="#templates" -->テンプレート<!-- /a --></li>
  <li><!-- a href="#smart_packages" -->スマートパッケージ<!-- /a --></li>
  <li><!-- a href="#deploying" -->デプロイ<!-- /a --></li>
</ul>
<dl>
  <dt>原文: <a href="http://docs.meteor.com/#concepts">http://docs.meteor.com/#concepts</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/06/08 - 最新バージョンが0.6.3.1 の時点での内容]</li>
  </ul>
  </dd>
</dl>


<p>Meteor 開発チームはこれまで貢献可能な形でそれぞれ Single-page JavaScript Applications* を手書きで書いてきました。
アプリケーション全体を1つのデータフォーマット、JSONと1つの言語、JavaScript で書くことはとても楽しいことです。
Meteor はそういったアプリケーションを書く際に必要となる全てを提供します。</p>

<div class="note">
* Single Page Application、通称 SPA。ユーザがブラウザ内でコンテンツ間を遷移する時にブラウザにヘッダからフッタまで、
全てのHTMLをブラウザに再度読み込ませるのではなく、 Ajax を用い動的にコンテンツデータのみを切り替え、データ通信量、
描画時のクライアント負荷を最小限に抑えた形の Web アプリケーションを指します。
</div>

<a name="structuring_your_app"></a>
<h2>アプリケーションの組み立て</h2>

<p>Meteor アプリケーションはウェブブラウザ (クライアント) で実行される JavaScript と、 Node.js コンテナの中で動く Meteor サーバで実行される JavaScript、そしてそれを支える HTML フラグメント、CSS 定義、静的データより構成されます。Meteor はそれらの異なるコンポーネントのパッケージ化と配信を自動化します。それだけてなく、ディレクトリ構造のなかでそれらの構造をどう構成するかについて、きわめて柔軟に対応します。</p>

<p>サーバ側の唯一のデータは JavaScript です。Meteor は (<code>client/</code> ディレクトリと <code>public/</code> ディレクトリ配下のファイルを除き) 全ての JavaScript ファイルをかき集め Fiber の中の Node.js サーバインスタンスにてそれらを読み込みます。Meteor では、サーバ側のコードは1つのリクエストに対し1つのスレッドの中で実行されます (Node の典型的な非同期コールバックのスタイルとは異なります)。Meteor 開発チームはこの同期実行モデルが典型的な Meteor アプリケーションに、より合致していると考えます。</p>

<div class="note">
* fiber: Node.js アプリケーションを同期的なプログラミングスタイルで記述することができる Node.js のサードパーティによる拡張機能。
</div>

<p>クライアントサイドではより多くの形のファイルが存在します。Meteor は (<code>server/</code> ディレクトリと <code>public/</code> ディレクトリ配下を除き) 全ての JavaScript ファイルをかき集め、軽量化を行いそれぞれのクライアントに配信します。アプリケーション向けに、1つの JavaScript ファイルを使うか、ディレクトリ別に階層化するか、それらの中間を採用するかは自由です。</p>

<p>いくつかの JavaScript ライブラリは <code>client/compatibility</code> ディレクトリに配置した時にだけ有効となります。このディレクトリの中のファイルは新しい変数スコープへとラップされることなく実行されます。これはそれぞれのファイル空間のグローバル変数として宣言された変数がグローバル変数となることを意味します。くわえて、これらのファイルは他のクライアントサイド JavaScript が実行される前に実行されます。</p>

<p><code>client/</code>, <code>server/</code>, <code>tests/</code>のいずれかのディレクトリ以外に配置されたファイルはクライアントサイドでも、サーバサイドでも読み込まれます! モデルの定義そしてその他の機能のために利用して下さい。Meteor はコードが実行されているのがクライアントサイドか、サーバサイドかによって挙動を変更するための <code>isClient</code> そして <code>isServer</code> という変数を提供しています。(<code>test/</code> と名付けられたディレクトリに配置されたファイルはいかなる場所においても読み込まれません)。</p>
</p>

<p>パスワードや認証の手順が含まれるような機密性の高いコードは <code>server/</code> ディレクトリに配置して下さい。</p>

<p>CSSファイルも同様にかき集められ、クライアントでは<code>server/</code>と<code>public/</code>配下に配置されたファイルを除き、1つのファイルとして受信されます。</p>

<p>デバッグの際には開発者モードを使うことでJavaScript と CSS ファイルが結合されずに送信することができます。</p>

<p>Meteor アプリケーションの HTML ファイルはサーバサイドフレームワークとはかなり異なる扱われ方をされます。Meteor は全てのディレクトリの HTML ファイルの&lt;head&gt;タグ、&lt;body&gt;タグそして&lt;template&gt;タグのスキャンを行います。&lt;head&gt;部と&lt;body&gt;部は別々に1つの&lt;head&gt;部と&lt;body&gt;部に結合され、クライアントサイドによる初回読み込み時に送信されます。 </p>

<p>一方Template部は JavaScript 関数に変換され、Template オブジェクトより参照可能です。これは HTML テンプレートをクライアントに送信する本当に便利な手法です。更に詳しいことは コンセプト:テンプレート をご確認下さい。 </p>

<p>最後に、Meteor サーバは <code>public/</code>ディレクトリ配下の全てのファイルを Rails や Django プロジェクトの様に配信します。これは画像や favicon.ico, robots.txt 等を配置する場所です。 </p>

<p>たとえば <code>Meteor.startup</code> API を利用したり、読み込みの順番に神経質となる必要があるコードを、他のパッケージとの兼ね合いを含めて明示的に制御することができるスマートパッケージに移行したりすることは、読み込みの順番に神経質なコードを書く際にベストな方法です。しかしながら、時によってはアプリケーションの読み込み順序への依存は避けられないこともあります。アプリケーションの中の JavaScript ファイルと CSS ファイルは次のルールによって読み込まれます。</p>
<ul>
  <li>アプリケーションルートの <code>lib/</code> ディレクトリにあるファイルが最初に読み込まれます。</li>
  <li>main.* に合致するファイルが他より先に読み込まれます。</li>
  <li>サブディレクトリに配置されたファイルが親ディレクトリよりも先に読み込まれます。つまり一番深い改装にあるファイルが最初(<code>lib/</code>配下の次)に読み込まれます。ルートディレクトリに配置されたファイルは (main.*に合致しないのであれば) 後に読み込まれます。
  <li>ディレクトリ内ではファイル名のアルファベット順に読み込まれます。</li>
</li>
</ul>

<p>上記のルールは掛け合わされ、その結果、例えば<code>lib/</code>ディレクトリの中でまたアルファベット順に読み込まれます。そして複数の main.js ファイルが(いくつかのディレクトリに)存在すれば、サブディレクトリに配置されたものが先行して読み込まれます。</p>
<a name="data_and_security"></a>
<h2>データとセキュリティ</h2>
<p> Meteor はクライアントに配布されるコードをローカルのデータベースとやり合う様にシンプルにします。個別のRPCエンドポイント作成やサーバからの返却の遅延を防ぐため手動でクライアントにデータをキャッシュしたり、データが変更されるたびに更新のメッセージを各クライアントに向け調整して配信する等を必要としない簡潔、シンプル、そして安全なアプローチです。 </p>

<p> Meteor では クライアントとサーバは同じデータベースAPIを提供します。バリデーション手続きや四則演算結果の値の算出の様なしばしばサーバサイド、クライアントサイドそれぞれで実行されるコードはまさに同一のコードです。しかしDBにアクセスするコードはサーバサイドで実行された場合、直接アクセスを行いますが、クライアントサイドで実行された場合には間接的なアクセスとなります。この区別は Meteor のデータセキュリティーモデルの基本となります。 </p>

<div class="note">
デフォルト設定では、Meteor アプリケーションは autopublish 並びに insecure パッケージを含んでいます。これらのパッケージはクライアントサイドにがサーバが持つDBへのフルアクセスを提供します。便利なプロトタイピングツールですが、商用環境についてはそうではありません。準備が整い次第、これらのパッケージは取り除いて下さい。
</div>

<p>全ての Meteor クライアントは in-memory のデータベースキャッシュを含んでいます。クライアントサイドのキャッシュを管理するため、サーバは一連の JSON ドキュメント (≒DBに保存されたレコード) を publish し、クライアントはそれらを subscribe します。</p>

<p>現存する多くの Meteor アプリは、他のデータベースへのサポートも準備中ではありますが、その絶妙の相性より MongoDB をデータベースとして利用しています。 <code>Meteor.Collection</code> クラスは Mongo の collection の宣言とその操作のため利用され、Meteor の Mongo クライアントエミュレータである <code>Meteor.Collection</code> はクライアントサイド、サーバサイド双方のコードから利用することができます。</p>

{% highlight javascript %}
// collection を宣言します
// このコードはクライアントとサーバサイドに記述して下さい
Rooms = new Meteor.Collection("rooms");
Messages = new Meteor.Collection("messages");
Parties = new Meteor.Collection("parties");

// サーバサイド: 初回ドキュメントを挿入します
Rooms.insert({name: "Conference Room A"});
var myRooms = Rooms.find({}).fetch();
Messages.insert({text: "Hello world", room: myRooms[0]._id});
Parties.insert({name: "Super Bowl Party"});
{% endhighlight %}

<p>それぞれのドキュメントセット (≒テーブル内のレコード群) はサーバで publish 関数を使い宣言されます。この publish 関数はクライアントがドキュメントセットを subscribe するとき毎回実行されます。ドキュメントセットに含まれるデータは大抵の場合はデータベースクエリを publish するためのものです。</p>

{% highlight javascript %}
// サーバサイド: 全ての Room ドキュメントを publish します
Meteor.publish("all-rooms", function () {
  return Rooms.find(); // everything
});

// サーバサイド: 特定の Room に向けられた Message 全てを publish します
Meteor.publish("messages", function (roomId) {
  check(roomId, String);
  return Messages.find({room: roomId});
});

// サーバサイド: ログインユーザが閲覧可能な一連の Party を publish します
Meteor.publish("parties", function () {
  return Parties.find({$or: [{"public": true},
                             {invited: this.userId},
                             {owner: this.userId}]});
});
{% endhighlight %}

<p>publish 関数はクライアントにより異なる結果を提供することができます。(上掲サンプルコード) 最後の例では、ログイン済みのユーザは公開、当該ユーザ保有あるいは招待 (invited) された Party ドキュメントのみを閲覧することをできます。</p>

<p>一度 subscribe すると、クライアントはそのキャッシュを高速なローカルデータベースとしてキャッシュを利用します。クライアントサイドのコードは劇的にシンプルになります。読み込み時はサーバへのリクエスト・レスポンス待機はコストが高いため決して行いません。読み込みの対象はコンテンツのキャッシュのみに限定されます。クライアントサイドではコレクションの中の全てのドキュメントに対するクエリは、サーバがそのクライアントに向けて publish しているドキュメントを返却します。</p>

{% highlight javascript %}
// クライアントサイド: Party の subscription を開始します
Meteor.subscribe("parties");

// クライアントサイド: このクライアントに権限が与えられた Party 配列を返却します
return Parties.find().fetch(); // 同期処理!!
{% endhighlight %}

<p>クライアントは知性的で、どの位のデータをキャッシュに保存するか、そしてネットワークトラフィックを制御するため subscribe 機能を有効化あるいは無効化することができます。subscribe 機能がが無効化された際には、そのドキュメントが他のアクティブな subscribe の対象になっていない限りそのドキュメントはキャッシュより削除されます。</p>

<p>クライアントサイドにて1つないしそれ以上のドキュメントが「変更」された場合、サーバに変更を要求するメッセージが送信されます。サーバサイドではクライアントから送信された「変更」が JavaScript の関数として書かれた許可/拒否のルールに反していないかチェックが行われます。サーバはすべてのルールをパスした「変更」のみ受け付けます。</p>

{% highlight javascript %}
// サーバサイド: クライアントに Party への追加を許可しません
Parties.allow({
  insert: function (userId, party) {
    return false;
  }
});

// クライアントサイド: 下記はうまくいきません
var party = { ... };
Parties.insert(party);
{% endhighlight %}

<p>サーバが変更を許容したならば、その変更はデータベースへの適用されます。そして変更があったドキュメントを subscribe しているクライアントへと、自動的にその変更を伝搬します。もし拒否した場合、変更を失敗とし、サーバサイドのデータベースには変更を加えず、他のクライアントが変更を目にすることはありません。</p>

<p>とはいえ、 Meteor にはかわいらしい魔法があります。クライアントがサーバに書き込みリクエストを送信した直後には、サーバからのレスポンスを待たずしてローカルのキャッシュが更新されます。つまり画面はすぐに再描画されます。もしサーバが更新を許容した場合 (多くの場合クライアントサイドにて期待されるケースです) クライアントは1世代先の状態を手にしていたことになり、画面を更新するためにレスポンスを待つ必要もありません。もしサーバが変更を拒絶した場合、Meteor はサーバが返却した結果をもとにクライアントサイドのキャッシュを修正します。</p>

<p>上記すべてが集まって、遅延の埋め合わせを行います。クライアントには必要なデータのホヤホヤなコピーがあり、サーバのレスポンスを待つ必要は決してありません。クライアントがデータを変更した時には、最終的な決裁はサーバに委ねるものの、その変更はサーバの承認を待つことなく実行されます。</p>

<a name="data_and_security-authentication_and_user_accounts"></a>
<h4>認証とユーザアカウント</h4>

<p>Meteor は "Meteor Acounts" 機能を提供します。それは最高水準の認証システムです。Secure Remote Password protocol [<a href="http://en.wikipedia.org/wiki/Secure_Remote_Password_protocol">英語版 Wikipedia</a>, <a href="https://access.redhat.com/site/documentation/ja-JP/JBoss_Enterprise_Application_Platform/5/html/Security_Guide/chap-Secure_Remote_Password_Protocol.html">RedHatによる日本語記事</a>] を使った安全なパスワードログインと、Facebook, GitHub, Google, Meetup, Twitter そして新浪微博を含む外部サービスとの間のインターフェイスを提供します。Meteor Acount は 開発者がアプリケーション固有のユーザを保存することができる <code>Meteor.users</code> コレクションを提供します。</p>

<p>Meteor はまたログイン, 入会, パスワード変更, パスワード紛失メールの発行といった一般的な手続きを行うフォームを提供します。"Accouts UI" はたった1行のコードで追加することができます。スマートパッケージ <code>accounts-ui</code> はアプリケーションで利用する外部ログインをセットアップするための設定ウィザードも提供してます。</p>

<a name="data_and_security-input_validation"></a>
<h4>入力データのバリデーション処理</h4>
<p>Meteor を使うとアプリケーションのコードと publish 関数で JSON タイプの全てのデータを扱うことができます。(実際には Meteor の通信プロトコルはバイナリバッファの様な型をサポートするJSON拡張のEJSONをサポートします。) JavaScript の動的型付けによりアプリケーションで使う変数全てに厳密な型を宣言する必要はありませんが、クライアントよりアプリケーションのコードや publish 関数に渡される引数が期待したものかが保証されれば便利です。</p>

<p>Meteor は引数とその他の値がそれぞれに期待された型かをチェックする軽量なライブラリ (Match API) を提供します。<code>check(username, String)</code> や <code>check(office, \{building: String, room: Number\})</code>の様な形で利用することができます。<code>check</code>は引数が期待しない形であった場合にエラーを投げます。</p>

<p>Meteor はまたアプリケーションのコードと publish 関数の引数をバリデートする便利な機能を提供します。

{% highlight bash %}
$ meteor add audit-argument-checks
{% endhighlight %}

上記コードを実行すると、引数に対し <code>check</code> を行わないアプリケーションのコードと publish 関数は例外を投げるようになります。
</p>

<!-- a name="reactivity"></a>
<h3>レスポンス速度</h3>
<a name="live_html"></a>
<h3>Live HTML</h3>
<a name="templates"></a>
<h3>テンプレート</h3>
<a name="smart_packages"></a>
<h3>スマートパッケージ</h3>
<a name="deploying"></a>
<h3>デプロイ</h3 -->
</article>