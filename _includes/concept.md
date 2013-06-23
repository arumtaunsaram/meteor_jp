<article class="solidArticle" id="solidArticle_concept">
<h2>設計概念</h2>
<ul>
  <li><a href="#structuring_your_app">アプリケーションの組み立て</a></li>
  <li><a href="#data_and_security">データとセキュリティ</a></li>
  <ul>
    <li><a href="#data_and_security-authentication_and_user_accounts">認証とユーザアカウント</a></li>
    <li><a href="#data_and_security-input_validation">入力データのバリデーション処理</a></li>
  </ul>
  <li><!-- a href="#reactivity" -->リアクティブプログラミング<!-- /a --></li>
  <li><!-- a href="#live_html" -->Live HTML<!-- /a --></li>
  <li><!-- a href="#templates" -->テンプレート<!-- /a --></li>
  <li><a href="#smart_packages">スマートパッケージ</a></li>
  <li><!-- a href="#deploying" -->デプロイ<!-- /a --></li>
</ul>
<dl>
  <dt>原文: <a href="http://docs.meteor.com/#concepts">http://docs.meteor.com/#concepts</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/06/23 - 最新バージョンが0.6.4 の時点での内容]</li>
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

<p>いくつかの JavaScript ライブラリは <code>client/compatibility/</code> ディレクトリに配置した時にだけ有効となります。このディレクトリの中のファイルは新しい変数スコープへとラップされることなく実行されます。これはそれぞれのファイル空間のグローバル変数として宣言された変数がグローバル変数となることを意味します。くわえて、これらのファイルは他のクライアントサイド JavaScript が実行される前に実行されます。</p>

<p><code>client/</code>, <code>server/</code>, <code>tests/</code>のいずれかのディレクトリ以外に配置されたファイルはクライアントサイドでも、サーバサイドでも読み込まれます! モデルの定義そしてその他の機能のために利用して下さい。Meteor はコードが実行されているのがクライアントサイドか、サーバサイドかによって挙動を変更するための <code>isClient</code> そして <code>isServer</code> という変数を提供しています。(<code>test/</code> と名付けられたディレクトリに配置されたファイルはいかなる場所においても読み込まれません)。</p>
</p>

<p>パスワードや認証の手順が含まれるような機密性の高いコードは <code>server/</code> ディレクトリに配置して下さい。</p>

<p>CSSファイルも同様にかき集められ、クライアントでは<code>server/</code>と<code>public/</code>配下に配置されたファイルを除き、1つのファイルとして受信されます。</p>

<p>デバッグの際には開発者モードを使うことでJavaScript と CSS ファイルが結合されずに送信することができます。</p>

<p>Meteor アプリケーションの HTML ファイルはサーバサイドフレームワークとはかなり異なる扱われ方をされます。Meteor は全てのディレクトリの HTML ファイルの&lt;head&gt;タグ、&lt;body&gt;タグそして&lt;template&gt;タグのスキャンを行います。&lt;head&gt;部と&lt;body&gt;部は別々に1つの&lt;head&gt;部と&lt;body&gt;部に結合され、クライアントサイドによる初回読み込み時に送信されます。 </p>

<p>一方 Template 部は JavaScript 関数に変換され、Template オブジェクトより参照可能です。これは HTML テンプレートをクライアントに送信する本当に便利な手法です。更に詳しいことは コンセプト:テンプレート をご確認下さい。 </p>

<p>最後に、Meteor サーバは <code>public/</code>ディレクトリ配下の全てのファイルを Rails や Django プロジェクトの様に配信します。これは画像や favicon.ico, robots.txt 等を配置する場所です。 </p>

<p>たとえば <code>Meteor.startup</code> API を利用したり、読み込みの順番に神経質となる必要があるコードを、他のパッケージとの兼ね合いを含めて明示的に制御することができるスマートパッケージに移行したりすることは、読み込みの順番に神経質なコードを書く際にベストな方法です。しかしながら、時によってはアプリケーションの読み込み順序への依存は避けられないこともあります。アプリケーションの中の JavaScript ファイルと CSS ファイルは次のルールによって読み込まれます。</p>
<ul>
  <li>アプリケーションルートの <code>lib/</code> ディレクトリにあるファイルが最初に読み込まれます。</li>
  <li>main.* に合致するファイルが他より先に読み込まれます。</li>
  <li>サブディレクトリに配置されたファイルが親ディレクトリよりも先に読み込まれます。つまり一番深い改装にあるファイルが最初(<code>lib/</code>配下の次)に読み込まれます。ルートディレクトリに配置されたファイルは (main.*に合致しないのであれば) 後に読み込まれます。
  <li>ディレクトリ内ではファイル名のアルファベット順に読み込まれます。</li>
</li>
</ul>

<p>上記のルールは掛け合わされ、その結果、例えば<code>lib/</code>ディレクトリの中でまたアルファベット順に読み込まれます。そして複数の main.js ファイルが (いくつかのディレクトリに) 存在すれば、サブディレクトリに配置されたものが先行して読み込まれます。</p>
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

<p>サーバが変更を許容したならば、その変更はデータベースへ適用されます。そして変更があったドキュメントを subscribe しているクライアントへと、自動的にその変更を伝搬します。もし拒否した場合、変更を失敗とし、サーバサイドのデータベースには変更を加えず、他のクライアントが変更を目にすることはありません。</p>

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
<!---
<a name="reactivity"></a>
<h3>リアクティブプログラミング</h3>
Meteor は、データの流れと変更の伝達に主眼を当てた リアクティブプログラミング [<a href="http://en.wikipedia.org/wiki/Reactive_programming">英語版 Wikipedia</a>] の思想を抱えています。すなわち、簡単な命令文でアプリケーションのコードがかけ、コードが参照しているデータに変更があった場合はいつでも自動的に再計算されることを意味しています。

{% highlight javascript %}
Deps.autorun(function () {
  Meteor.subscribe("messages", Session.get("currentRoomId"));
});
{% endhighlight %}

<p>上記の例 はセッション変数である <code>currentRoomId</code> にもとづくデータの subscribe を設定しています。もし何らかの理由で <code>Session.get("currentRoomId")</code> の値が変更された場合は、引数として与えられた関数は自動的に実行され、古い設定を上書きする形で新しい subscribe を設定します。</p>

TODO:
<p>この自動的な再計算は <code>Session</code> と <code>Deps.autorun</code> が互いに協力して実現します。<code>Deps.autorun</code> は任意の<!-- arbitorary what? ->、依存関係が監視されたデータを内部で新しい値とともに評価し、必要に応じて引数として渡された関数の再実行を行います。一方ではデータを提供する <code>Session</code> の様なものは、呼び出しが行われた式やどのようなデータがリクエストされたかを記憶し、データの変更が行われなときに無効化のシグナルを送る準備をしています。
</p>

<p>この、応答可能な評価と応答可能なデータソースのシンプルなパターンは大きな適応能力を持っています。さらに、subscribe 中断、再 subscribe の呼び出しや正しいタイミングで呼び出されているか保証を行うコードの記述から開発者を解放します。大抵の場合、Meteor を使うことでエラーが侵入しがちなデータ伝搬クラスすべてを取り除くことができます。
</p>

<p>下記の Meteor の機能はアプリケーションのコードを応答可能な評価として実行します。</p>
<ul>
  <li>テンプレート</li>
  <li><code>Meteor.render</code> と <code>Meteor.renderList</code></li>
  <li><code>Deps.autorun</code></li>
</ul>
<p>そして変更を伝搬することができる応答可能なデータソースとして
<ul>
  <li><code>Session</code>変数</li>
  <li>コレクションに対するDBクエリ</li>
  <li><code>Meteor.status</code></li>
  <li>subscribe ハンドラの <code>ready()</code>メソッド</li>
  <li><code>Meteor.user</code></li>
  <li><code>Meteor.userId</code></li>
  <li><code>Meteor.loggingIn</code></li>
</ul>
があります。</p>
<p>さらに、次の機能は <code>stop</code> メソッドを持つオブジェクトを返却し、もし応答可能な評価より呼びだされたら評価が再実行あるいは停止された時に機能は停止されます。</p><!-- 停止と stop が指す内容を要確認 ->
<ul>
  <li><code>Deps.autorun</code>(ネストし-入れ子状になっ-ています)</li>
  <li><code>Meteor.subscribe</code></li>
  <li><code>observe()</code> そしてカーソラの <code>observeChanges()</code> </li>
</ul>
<p>Meteor の実装は <code>Deps</code> と呼ばれるパッケージで、<code>Deps</code> は単刀直入です<!-- of what? how? ->。新らしく応答可能なデータソースを1から作成する際には利用することになるでしょう。</p>
-->
<!---
<a name="live_html"></a>
<h3>Live HTML</h3>
HTML のテンプレート化はウェブアプリケーションの中心です。Meteor のライブページ更新機能を使うとアプリケーションの HTML を一つの応答として描画することができます、つまり生成に使ったデータの変更を追跡し自動的に更新することができます。</p>
<p>この選択可能な機能はどんなHTMLテンプレート提供ライブラリとでも、またアプリケーションの中の JavaScript で生成した HTML とでさえ協調が可能です。例をご覧ください。</p>

{% highlight javascript %}
var fragment = Meteor.render(
  function () {
    var name = Session.get("name") || "Anonymous";
    return "<div>Hello, " + name + "</div>";
  });
document.body.appendChild(fragment);

Session.set("name", "Bob"); // ページは自動的に更新します!
{% endhighlight %}

<p><code>Meteor.render</code> は描画を行う関数を引数としてとります。この関数は HTML を表す文字列を返す関数です。</p>
-->
<!--a name="templates"></a>
<h3>テンプレート</h3 -->
<a name="smart_packages"></a>
<h3>スマートパッケージ</h3>

<p>Meteor は尋常でないほど強力なパッケージシステムを具えています。今まで紹介してきた機能は標準の Meteor パッケージにより実装されています。</p>

<p>Meteor のパッケージは知的で、パッケージそれ自身が JavaScript のプログラムです。パッケージは Meteor の環境を任意の方法で拡張するため、クライアントあるいはサーバのコードに介入することや、コマンドラインツールに新しい関数をフックさせることができます。いくつかのパッケージの例として:</p>
<ul>
  <li>cofffescript パッケージはコマンドラインツールを拡張し、アプリケーションのディレクトリツリーの中のすべての .coffee ファイルを自動的にコンパイルします。一度追加すると JavaScript の代わりに CoffeeScript でアプリケーションを記述することができます。</li>
  <li>jQuery と Backbone パッケージはクライアントサイドの JavaScript ライブラリを Meteor のパッケージ化した具体例です。JavaScript のファイルをディレクトリツリーにコピーすることでも同じ結果が得られますが、パッケージに追加するのがより高速です。</li>
  <li>Underscore パッケージはクライアントとサーバ双方の環境を拡張します。</li>
</ul>

<p>Minimongo、セッションオブジェクトや反応可能な Handlebar テンプレートを含む多くのコアの Meteor の機能は、すべての Meteor アプリケーションに自動的に含まれる内部的なパッケージとして実装されています。</p>

<p>`meteor list` を使うと利用可能なパッケージのリストが確認できます。`meteor add` でパッケージをプロジェクトに追加することができます。`meteor remove` でそれらを削除することができます。</p>

<!-- TODO to prepare translation of api-packages in the apiref -->
<strong>パッケージ API は頻繁に変更されていて、ドキュメントもないため、現在の時点ではパッケージを作ることはできません。乞うご期待。</strong>

<!-- a name="deploying"></a>
<h3>デプロイ</h3 -->
</article>
