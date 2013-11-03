<article class="solidArticle" id="solidArticle_concept">
<h2>設計概念</h2>
<ul>
  <li><a href="#what_is_meteor">Meteor とは</a></li>
  <li><a href="#structuring_your_app">アプリケーションの組み立て</a></li>
  <li><a href="#data_and_security">データとセキュリティ</a></li>
  <ul>
    <li><a href="#data_and_security-authentication_and_user_accounts">認証とユーザアカウント</a></li>
    <li><a href="#data_and_security-input_validation">入力データのバリデーション処理</a></li>
  </ul>
  <li><a href="#reactivity">リアクティブプログラミング</a></li>
  <li><a href="#live_html">ライブHTML</a></li>
  <li><a href="#templates">テンプレート</a></li>
  <li><a href="#using_packages">パッケージの利用</a></li>
  <li><a href="#namespacing">名前空間</a></li>
  <li><a href="#deploying">デプロイ</a></li>
  <li><a href="#writing_packages">パッケージの作成</a></li>
</ul>
<dl>
  <dt>原文: <a href="http://docs.meteor.com/#concepts">http://docs.meteor.com/#concepts</a><dt>
  <dd>
  <ul>
    <li>[訳文の最終更新 2013/11/03 (JST) - 最新バージョンが0.6.6.2 の時点での内容]</li>
  </ul>
  </dd>
</dl>


<p>Meteor 開発チームはこれまで貢献可能な形でそれぞれ Single-page JavaScript Applications* を手書きで書いてきました。
アプリケーション全体を1つのデータフォーマット、JSONと1つの言語、JavaScript で書くことはとても楽しいことです。
Meteor はそういったアプリケーションを書く際に必要となる全てを提供します。</p>

<div class="note">
(訳注) * Single Page Application、通称 SPA。ユーザがブラウザ内でコンテンツ間を遷移する時にブラウザにヘッダからフッタまで、
全てのHTMLをブラウザに再度読み込ませるのではなく、 Ajax を用い動的にコンテンツデータのみを切り替え、データ通信量、
描画時のクライアント負荷を最小限に抑えた形の Web アプリケーションを指します。
</div>

<a name="what_is_meteor"></a>
<h2>Meteor とは</h2>
<p>Meteor とは2つのものを指します。</p>
<dl>
  <dt>パッケージライブラリ: アプリケーションに必要となるだろう事前に書かれた、独立したモジュール。</dt>
  <dd>大抵のアプリケーションが使うであろう沢山のコア Meteor パッケージがあります (たとえば、寄せられるHTTP接続を操作する webapp、そしてデータが変更された時にその場で更新されるHTMLテンプレートを作成する場合に使う templating) 。くわえてメール送信機能を提供する email のような、あるいはアプリケーションにそのまま利用できるすべての機能を備えた一連の Meteor Accounts (account-password, accounts-facebook, accounts-ui など) のような選択可能なパッケージがあります。そしてそれらの「公式な」パッケージ以上に、数千ものコミュニティーによって書かれたパッケージが <a href="https://atmosphere.meteor.com/">Atmosphere</a> に存在し、それらの一部はまさに望んでいた機能を提供してくれるかもしれません。</dd>
  <dt>meteor と呼ばれるコマンドラインツール</dt>
  <dd>meteor は make、rake、あるいは Visual Studio の見えない部分に当たるビルドツールです。アプリケーション内のすべてのソースファイルと素材を寄せ集め、それらを必要なビルドステップへと持ち込み (<a href="http://coffeescript.org/">CoffeeScript</a> のコンパイル、CSSの最適化、<a href="https://npmjs.org/">npm</a> モジュールのビルドあるいはソースマップの作成など) 、アプリケーションが使用するパッケージを取得し、そして実行可能な独立したアプリケーションバンドルを出力します。開発モードではファイルを変更した場合はいつでもすぐに変更がブラウザで確認できるよう、それらすべては相互作用的に行われます。環境に依存せず利用するのにとても簡単で、かつ拡張性のある方法です。たとえばビルドプラグインパッケージをアプリケーションに追加すると、新しい言語とコンパイラへのサポートを追加することができます。</dd>
</dl>
Meteor パッケージシステムの要となる思想は「すべてはブラウザであろうとサーバであろうと同じように動く(もちろん、成立可能な範囲でどこでも-ブラウザがメールを送信できませんし、サーバでマウスイベントを拾うことはできません)」ということです。Meteor のすべてのエコシステムはこれをサポートするために生まれました。

<div class="note">
meteor はまだ Atmosphere からパッケージを取得することができません。もし Atmosphere を使おうとしているのなら、Atmosphere パッケージのダウンロードと管理を行うツール <a href="http://oortcloud.github.io/meteorite/">Meteorite</a> をご確認ください。<br />
Meteor 1.0 においては、ビルドツール meteor は Atmosphere の完全なサポートを行う予定です。
</div>



<a name="structuring_your_app"></a>
<h2>アプリケーションの組み立て</h2>

<p>Meteor アプリケーションはウェブブラウザ (クライアント) で実行される JavaScript と、 Node.js コンテナの中で動く Meteor サーバで実行される JavaScript、そしてそれを支える HTML フラグメント、CSS 定義、静的データより構成されます。Meteor はそれらの異なるコンポーネントのパッケージ化と配信を自動化します。それだけてなく、ディレクトリ構造のなかでそれらの構造をどう構成するかについて、きわめて柔軟に対応します。</p>

<p>サーバ側の唯一のデータは JavaScript です。Meteor は (client/ ディレクトリと public/ ディレクトリ配下のファイルを除き) 全ての JavaScript ファイルをかき集め Fiber* の中の Node.js サーバインスタンスにてそれらを読み込みます。Meteor では、サーバ側のコードは1つのリクエストに対し1つのスレッドの中で実行されます (Node の典型的な非同期コールバックのスタイルとは異なります)。Meteor 開発チームはこの同期実行モデルが典型的な Meteor アプリケーションに、より合致していると考えます。</p>

<div class="note">
(訳注) * Fiber: Node.js アプリケーションを同期的なプログラミングスタイルで記述することができる Node.js のサードパーティによる拡張機能。
</div>

<p>クライアントサイドではより多くの形のファイルが存在します。Meteor は (server/ ディレクトリと public/ ディレクトリ配下を除き) 全ての JavaScript ファイルをかき集め、軽量化を行いそれぞれのクライアントに配信します。アプリケーション向けに、1つの JavaScript ファイルを使うか、ディレクトリ別に階層化するか、それらの中間を採用するかは自由です。</p>

<p>いくつかの JavaScript ライブラリは client/compatibility/ ディレクトリに配置した時にだけ有効となります。このディレクトリの中のファイルは新しい変数スコープへとラップされることなく実行されます。これはそれぞれのファイル空間のグローバル変数として宣言された変数がグローバル変数となることを意味します。くわえて、これらのファイルは他のクライアントサイド JavaScript が実行される前に実行されます。</p>

<p>client/, server/, tests/のいずれかのディレクトリ以外に配置されたファイルはクライアントサイドでも、サーバサイドでも読み込まれます! モデルの定義そしてその他の機能のために利用して下さい。Meteor はコードが実行されているのがクライアントサイドか、サーバサイドかによって挙動を変更するための isClient そして isServer という変数を提供しています。(test/ と名付けられたディレクトリに配置されたファイルはいかなる場所においても読み込まれません)。</p>
</p>

<p>パスワードや認証の手順が含まれるような機密性の高いコードは server/ ディレクトリに配置して下さい。</p>

<p>CSSファイルも同様にかき集められ、クライアントではserver/とpublic/配下に配置されたファイルを除き、1つのファイルとして受信されます。</p>

<p>デバッグの際には開発者モードを使うことでJavaScript と CSS ファイルが結合されずに送信することができます。</p>

<p>Meteor アプリケーションの HTML ファイルはサーバサイドフレームワークとはかなり異なる扱われ方をされます。Meteor は全てのディレクトリの HTML ファイルの&lt;head&gt;タグ、&lt;body&gt;タグそして&lt;template&gt;タグのスキャンを行います。&lt;head&gt;部と&lt;body&gt;部は別々に1つの&lt;head&gt;部と&lt;body&gt;部に結合され、クライアントサイドによる初回読み込み時に送信されます。 </p>

<p>一方 Template 部は JavaScript 関数に変換され、Template オブジェクトより参照可能です。これは HTML テンプレートをクライアントに送信する本当に便利な手法です。更に詳しいことは <a href="#templates">コンセプト:テンプレート</a> をご確認下さい。 </p>

<p>最後に、Meteor サーバは public/ディレクトリ配下の全てのファイルを Rails や Django プロジェクトの様に配信します。これは画像や favicon.ico, robots.txt 等を配置する場所です。 </p>

<p>たとえば Meteor.startup API を利用したり、読み込みの順番に神経質となる必要があるコードを、他のパッケージとの兼ね合いを含めて明示的に制御することができるスマートパッケージに移行したりすることは、読み込みの順番に神経質なコードを書く際にベストな方法です。しかしながら、時によってはアプリケーションの読み込み順序への依存は避けられないこともあります。アプリケーションの中の JavaScript ファイルと CSS ファイルは次のルールによって読み込まれます。</p>
<ul>
  <li>アプリケーションルートの lib/ ディレクトリにあるファイルが最初に読み込まれます。</li>
  <li>main.* に合致するファイルが他より先に読み込まれます。</li>
  <li>サブディレクトリに配置されたファイルが親ディレクトリよりも先に読み込まれます。つまり一番深い改装にあるファイルが最初(lib/配下の次)に読み込まれます。ルートディレクトリに配置されたファイルは (main.*に合致しないのであれば) 後に読み込まれます。
  <li>ディレクトリ内ではファイル名のアルファベット順に読み込まれます。</li>
</li>
</ul>

<p>上記のルールは掛け合わされ、その結果、例えばlib/ディレクトリの中でまたアルファベット順に読み込まれます。そして複数の main.js ファイルが (いくつかのディレクトリに) 存在すれば、サブディレクトリに配置されたものが先行して読み込まれます。</p>
<a name="data_and_security"></a>
<h2>データとセキュリティ</h2>
<p> Meteor はクライアントに配布されるコードをローカルのデータベースとやり合う様にシンプルにします。個別のRPCエンドポイント作成やサーバからの返却の遅延を防ぐため手動でクライアントにデータをキャッシュしたり、データが変更されるたびに更新のメッセージを各クライアントに向け調整して配信する等を必要としない簡潔、シンプル、そして安全なアプローチです。 </p>

<p> Meteor では クライアントとサーバは同じデータベースAPIを提供します。バリデーション手続きや四則演算結果の値の算出の様なしばしばサーバサイド、クライアントサイドそれぞれで実行されるコードはまさに同一のコードです。しかしDBにアクセスするコードはサーバサイドで実行された場合、直接アクセスを行いますが、クライアントサイドで実行された場合には間接的なアクセスとなります。この区別は Meteor のデータセキュリティーモデルの基本となります。 </p>

<div class="note">
デフォルト設定では、Meteor アプリケーションは autopublish 並びに insecure パッケージを含んでいます。これらのパッケージはクライアントサイドにがサーバが持つDBへのフルアクセスを提供します。便利なプロトタイピングツールですが、商用環境についてはそうではありません。準備が整い次第、これらのパッケージは取り除いて下さい。
</div>

<p>全ての Meteor クライアントは in-memory のデータベースキャッシュを含んでいます。クライアントサイドのキャッシュを管理するため、サーバは一連の JSON ドキュメント (≒DBに保存されたレコード) を publish し、クライアントはそれらを subscribe します。</p>

<p>現存する多くの Meteor アプリは、他のデータベースへのサポートも準備中ではありますが、その絶妙の相性より MongoDB をデータベースとして利用しています。 Meteor.Collection クラスは Mongo の collection の宣言とその操作のため利用され、Meteor の Mongo クライアントエミュレータである Meteor.Collection はクライアントサイド、サーバサイド双方のコードから利用することができます。</p>

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

<p>それぞれのドキュメントセット (訳注≒テーブル内のレコード群) はサーバで publish 関数を使い宣言されます。この publish 関数はクライアントがドキュメントセットを subscribe するとき毎回実行されます。ドキュメントセットに含まれるデータは大抵の場合はデータベースクエリを publish するためのものです。</p>

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

<p>一度 subscribe すると、クライアントはそのキャッシュを高速なローカルデータベースとして利用します。クライアントサイドのコードは劇的にシンプルになります。読み込み時はサーバへのリクエスト・レスポンス待機はコストが高いため決して行いません。読み込みの対象はコンテンツのキャッシュのみに限定されます。クライアントサイドではコレクションの中の全てのドキュメントに対するクエリは、サーバがそのクライアントに向けて publish しているドキュメントを返却します。</p>

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
<h3>認証とユーザアカウント</h3>

<p>Meteor は "Meteor Acounts" 機能を提供します。それは最高水準の認証システムです。Secure Remote Password protocol [<a href="http://en.wikipedia.org/wiki/Secure_Remote_Password_protocol">英語版 Wikipedia</a>, <a href="https://access.redhat.com/site/documentation/ja-JP/JBoss_Enterprise_Application_Platform/5/html/Security_Guide/chap-Secure_Remote_Password_Protocol.html">RedHatによる日本語記事</a>] を使った安全なパスワードログインと、Facebook, GitHub, Google, Meetup, Twitter そして新浪微博を含む外部サービスとの間のインターフェイスを提供します。Meteor Acount は 開発者がアプリケーション固有のユーザを保存することができる Meteor.users コレクションを提供します。</p>

<p>Meteor はまたログイン, 入会, パスワード変更, パスワード紛失メールの発行といった一般的な手続きを行うフォームを提供します。"Accouts UI" はたった1行のコードで追加することができます。スマートパッケージ accounts-ui はアプリケーションで利用する外部ログインをセットアップするための設定ウィザードも提供してます。</p>

<a name="data_and_security-input_validation"></a>
<h3>入力データのバリデーション処理</h3>
<p>Meteor を使うとアプリケーションのコードと publish 関数で JSON タイプの全てのデータを扱うことができます。(実際には Meteor の通信プロトコルはバイナリバッファの様な型をサポートするJSON拡張のEJSONをサポートします。) JavaScript の動的型付けによりアプリケーションで使う変数全てに厳密な型を宣言する必要はありませんが、クライアントよりアプリケーションのコードや publish 関数に渡される引数が期待したものかが保証されれば便利です。</p>

<p>Meteor は引数とその他の値がそれぞれに期待された型かをチェックする軽量なライブラリ (Match API) を提供します。check(username, String) や check(office, {building: String, room: Number})の様な形で利用することができます。checkは引数が期待しない形であった場合にエラーを投げます。</p>

<p>Meteor はまたアプリケーションのコードと publish 関数の引数をバリデートする便利な機能を提供します。

{% highlight bash %}
$ meteor add audit-argument-checks
{% endhighlight %}

上記コードを実行すると、引数に対し check を行わないアプリケーションのコードと publish 関数は例外を投げるようになります。
</p>

<a name="reactivity"></a>
<h2>リアクティブプログラミング</h2>
<p>Meteor は、データの流れと変更の伝達に主眼を当てた リアクティブプログラミング [<a href="http://en.wikipedia.org/wiki/Reactive_programming">英語版 Wikipedia</a>] の思想を抱えています。すなわち、簡単な命令文でアプリケーションのコードがかけ、コードが参照しているデータに変更があった場合はいつでも自動的に再計算されることを意味しています。</p>

{% highlight javascript %}
Deps.autorun(function () {
  Meteor.subscribe("messages", Session.get("currentRoomId"));
});
{% endhighlight %}

<p>上記の例 (チャットルームクライアントより拝借) はセッション変数である currentRoomId にもとづくデータの subscribe を設定しています。もし何らかの理由で Session.get("currentRoomId") の値が変更された場合は、引数として与えられた関数は自動的に実行され、古い設定を上書きする形で新しい subscribe を設定します。</p>

<p>この自動的な再計算は Session と Deps.autorun が互いに協力して実現しています。Deps.autorun は内部で任意の依存関係が監視された「反応可能な算出」の計算を行い、必要に応じて引数として渡された関数の再実行を行います。一方ではデータを提供する Session の様なデータ提供側は、呼び出しが行われた式やどのようなデータがリクエストされたかを記憶し、データの変更が行われなときに無効化のシグナルを送る準備をしています。 </p>

<p>この、反応可能な評価と反応可能なデータソースのシンプルなパターンは大きな適応能力を持っています。さらに、subscribe 中断、subscribe の再度呼び出しや正しいタイミングで呼び出されているか保証を行うコードの記述から開発者を解放します。大抵の場合、Meteor を使うことで、エラーが侵入しがちなデータ伝搬クラスすべてを取り除くことができます。
</p>

<p>下記の Meteor の機能はアプリケーションのコードを反応可能な評価として実行します。</p>
<ul>
  <li>テンプレート</li>
  <li>Meteor.render と Meteor.renderList</li>
  <li>Deps.autorun</li>
</ul>
<p>そして変更を伝搬することができる反応可能なデータソースとして
<ul>
  <li>Session変数</li>
  <li>コレクションに対するDBクエリ</li>
  <li>Meteor.status</li>
  <li>subscribe ハンドラの ready()メソッド</li>
  <li>Meteor.user</li>
  <li>Meteor.userId</li>
  <li>Meteor.loggingIn</li>
</ul>
があります。</p>
<p>さらに、次の stop メソッドを持つオブジェクトを返却する関数は、反応可能な評価より呼びだされた場合、算出が再実行あるいは停止された場合に停止されます。</p>
<ul>
  <li>Deps.autorun(ネストし-入れ子状になっ-たもの)</li>
  <li>Meteor.subscribe</li>
  <li>observe() そしてカーソラの observeChanges() </li>
</ul>
<p>Meteor の実装は Deps と呼ばれるパッケージで、Deps はとても短く簡潔です。新らしく反応可能なデータソースを1から作成する際には利用できます。</p>

<a name="live_html"></a>
<h2>ライブ HTML</h2>
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

<p><a href="{{ site.url }}/apiref/templates.html#Meteor_render">Meteor.render</a> は描画を行う関数を引数としてとります。この関数は HTML を文字列として返す関数です。Meteor.render は自動的に更新される DocumentFragmentを返却します。描画を行う関数にて使用されたデータに変更があると、再実行が行われます。DocumentFragmentの中のDOMノードではその後その場でページのどの部分に挿入されているかに関わらず自分自身を更新します。それは完全なる自動です。<a href="{{ site.url }}/apiref/templates.html#Meteor_render">Meteor.render</a> は<a href="#reactivity">リアクティブプログラミング</a>を使い、描画をおこなう関数がどのデータが利用されているのか判定します。</p>

<p>しかしながら大抵の場合、これらの関数を直接呼び出すことはなく、Handlebars や Jade の様なお好きなパッケージを使うだけで完結できます。render と renderList 関数は新たなテンプレートシステムを開発する方のために設計されています。</p>

<p>Meteor は必要なすべての更新と関数の実行をコードが実行されていない間にのみ実行します。この方法で開発者が任意のコードを実行している最中にDOMが変更されていない保証を提供します。ある場合にはこれとは異なる挙動が必要な場合があるでしょう。たとえば、データベースにレコードを挿入した直後、jQuery の様なライブラリを使い新しい要素が探し出せるよう、DOMの更新を強制したいかもしれません。その場合、<!-- a href -->Deps.flush<!-- /a --> を使いDOMを即座に最新の状態にすることができます。</p>

<p>ライブアップデートの対象のDOM要素が画面上から消え去った際には、自動的に後始末が行われます。コールバックが呼び出され、関連付けられたデータベースのクエリが停止され、更新が停止されます。このため、手打ちの更新ロジックの悩みの種となるゾンビテンプレート [ <a href="http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/">英語版 Backbone のゾンビテンプレートについての解説記事</a> ] について決して思い煩うことはありません。要素を後始末より保護したい場合、イベントループに返却する前、あるいは Deps.flush を実行する前にに要素が画面上にあるか確認してください。</p>

<p>手打ちの場合に頭を抱える要素は他に要素の維持という問題があります。ユーザが &lt;input&gt 要素にテキストを入力していると仮定して、その領域がページの再描画の対象だった場合です。&lt;input&gt;が再生成された時に、ユーザはフォーカス、カーソルの位置、一部を完了させていた入力内容とそのフォーマットを失う苦難を受けることとなります。</p>

<p>この事象もまた Meteor によって解決されます。テンプレートにて <a href="{{ site.url }}/apiref/templates.html#Template_myTemplate_preserve">preserve</a> を設定することで、テンプレートが再描画される際に維持される要素を指定することができます。Meteor は維持の指定がされた要素を囲う要素が再描画される場合でもこの要素を維持し、一方でその子要素を更新し、属性の変更は持ち越します。</p>

<a name="templates"></a>
<h2>テンプレート</h2>
<p>Meteor では簡単に Handlebars や Jade の様なお好みの HTML テンプレート言語を Meteor のライブページ更新技術と共に利用することができます。普段テンプレートを書くのと同じように書くだけで、Meteor にリアルタイムで更新されるように扱われる様になります。</p>

<p>この機能を使うにはプロジェクトの中に .html 拡張子がついたファイルを用意してください。このファイルでは name 属性を持つ &lt;template&gt; タグを作成してくださいテンプレートをこのタグの中においてください。Meteor は事前にテンプレートをコンパイルし、クライアントに送信し、グローバルの Template オブジェクトの関数としてこれを提供します。</p>

<p><strong>現段階では Meteor のパッケージとされている唯一のテンプレートシステムは Handlebars です。Meteor 開発チームに Meteor と一緒にどのテンプレートシステムを使いたいか教えてください。同時に、Handlebar ドキュメント[<a href="http://www.handlebarsjs.com/">英語版</a>] と Meteor Handlebars Extension [<a href="https://github.com/meteor/meteor/wiki/Handlebars">英語版</a>] をご確認ください。</strong></p>

<p>name に hello を設定したテンプレートは Template.hello 関数に様々なデータを渡し呼び出すことで描画されます</p>

{% highlight html %}
<template name="hello">
  <div class="greeting">こんにちは、{{ "{{first"}}}} {{ "{{last"}}}}! </div>
</template>

// JavaScript コンソールにて
> Template.hello({first: "Alyssa", last: "Hacker"});
 => "<div class="greeting">こんにちは、Alyssa Hacker!</div>"
{% endhighlight %}

上記の例では文字列が返却されます。テンプレートで<a href="#live_html">ライブHTML機能</a>を利用しDOM要素をその場で自動的に更新するには、<a href="{{ site.url }}/apiref/templates.html#Meteor_render">Meteor.render</a> を使ってください。

{% highlight javascript %}
Meteor.render(function () {
  return Template.hello({first: "Alyssa", last: "Hacker"});
})
 => DOM要素を自動的に更新し続けます。
{% endhighlight %}

<p>テンプレートにデータを組み込む際に最も簡単な方法は JavaScript でヘルパ関数を定義する方法です。Template.[テンプレート名] に直接関数を追加するだけです。たとえば、テンプレートでは</p>

{% highlight html %}
<template name="players">
  {{ "{{#each topScorers"}}}}
    <div>{{ "{{name"}}}}</div>
  {{ "{{/each"}}}}
</template>
{% endhighlight %}

<p>テンプレート関数が呼び出されれる際、topScores にデータを与えるかわりに、Template.players に関数を定義します。</p>

{% highlight javascript %}
Template.players.topScorers = function () {
  return Users.find({score: {$gt: 100}}, {sort: {score: -1}});
};
{% endhighlight %}

<p>この場合、データはデータベースのクエリに由来します。#each にデータベースのカーソラが渡された場合、新しい結果がクエリに入り込むと効率的に全自動でDOMノードの追加、移動を行うよう設定されます。</p>

<p>ヘルパには引数を渡すことができ、関数は現在のテンプレートのデータを this として受け取ります。</p>

{% highlight javascript %}
// JavaScript ファイルにて
Template.players.leagueIs = function (league) {
  return this.league === league;
};
{% endhighlight %}

{% highlight html %}
<template name="players">
  {{ "{{#each topScorers"}}}}
    {{ '{{#if leagueIs "junior"'}}}}
      <div>ジュニアリーグ: {{ "{{name"}}}}</div>
    {{ '{{/if'}}}}
    {{ '{{#if leagueIs "senior"'}}}}
      <div>シニアリーグ: {{ "{{name"}}}}</div>
    {{ '{{/if'}}}}
  {{ '{{/each'}}}}
</template>
{% endhighlight %}

<p><strong>Handlebars 追加情報: {{ '{{#if leagueIs "junior"'}}}} はブロックヘルパにおける入れ子構造を受け入れる Meteor の拡張にて認められる表現です。( if と leagueIs は技術的にはどちらもヘルパで、標準の Handlebars はここでは leaguesIs は実行をしません。)</strong></p>

ヘルパには定数を指定することもできます。

{% highlight javascript %}
// {{" {{#each sections"}}}} で呼び出してください
Template.report.sections = ["現状", "課題", "解決策"];
{% endhighlight %}

最後に、イベントハンドラ群のテーブルを設定する場合テンプレート関数で events 宣言を使うことができます。フォーマットは<a href="{{ site.url }}/apiref/templates.html#Template_Event_Maps">イベントマップ</a>にまとめています。イベントハンドラ内の this はイベントを発行した要素のデータコンテキストとなります。

{% highlight html %}
<template name="scores">
  {{ "{{#each player"}}}}
    {{ "{{> playerScore"}}}}
  {{ "{{/each"}}}}
</template>

<template name="playerScore">
  <div>{{" {{name"}}}}: {{" {{score"}}}}
    <span class="givePoints">得点を与える</span>
  </div>
</template>
{% endhighlight %}

{% highlight javascript %}
Template.playerScore.events({
  'click .givePoints': function () {
    Users.update(this._id, {$inc: {score: 2}});
  }
});
{% endhighlight %}

まとめると、任意のデータをテンプレートに組み込む例は下掲のようになり、データに変更が加えられた時に自動的に更新されます。さらなる議論については<a href="#live_html">ライブHTML</a>をご確認ください。

{% highlight html %}
<template name="forecast">
  <div>今夜は{{ "{{prediction"}}}}天気となる見込</div>
</template>
{% endhighlight %}

{% highlight javascript %}
// JavaScript: 反応可能となるヘルパ関数
Template.forecast.prediction = function () {
  return Session.get("weather");
};
{% endhighlight %}

{% highlight text %}
> Session.set("weather", "くもった");
> document.body.appendChild(Meteor.render(Template.forecast));
DOMでは:  <div>今夜はくもった天気となる見込</div>

> Session.set("weather", "寒く乾燥した");
DOMでは:  <div>今夜は寒く乾燥した天気となる見込</div>
{% endhighlight %}

<a name="using_packages"></a>
<h2>パッケージの利用</h2>

<p>ここまで記述してきた機能はすべて標準 Meteor パッケージとして実装されています。Meteor の並外れて強力なパッケージそしてビルドシステムによって成り立っています。ブラウザとサーバにて同じパッケージが動き、パッケージにはビルド手続きを拡張する coffeescript (<a href="http://coffeescript.org/">CoffeeScript</a> のコンパイル) や templating (HTML テンプレートのコンパイル) の様なプラグインを含めることができます。</p>

<p>meteor listを使うと利用可能なパッケージの確認、meteor add でプロジェクトにパッケージの追加、meteor remove で削除することができます。</p>

<p>デフォルト設定ではすべてのアプリケーションには standard-app-packages パッケージが含まれます。このパッケージはコアの Meteor スタックを構成するパッケージをひっぱり出します。事をシンプルにするため、これらのコアパッケージは meteor list の出力では隠されていますが、それらが何であるかを確認するため、<a href="https://github.com/meteor/meteor/blob/master/packages/standard-app-packages/package.js">standard-app-packages のソースコード</a>) を見ることもできます (Meteor はまだ 1.0 に達していないので、リリースごとに変更されるでしょう)。もし独自のスタックを作りたい場合は、standard-app-packages をアプリケーションから削除し、継続して利用したい標準パッケージを追加して戻してください。</p>

<p>公式な Meteor のリリースの中のパッケージでアプリケーションに現在利用されているパッケージに加え meteor list と meteor add はアプリケーションのトップに存在する packages ディレクトリも検索します。もし非公式のパッケージを Atmosphere からダウンロードしたのであればこのディレクトリに展開してください (非公式の <a href="http://oortcloud.github.io/meteorite/">Meteorite</a> ツールは効率的にこの過程を辿ります) 。packages ディレクトリはまたアプリケーションを便宜のためサブパッケージに分割する際に利用することができますーもし Meteor パッケージのフォーマットがまだドキュメント化されていなく、Meteor 1.0 の前に大幅な変更が加えるられることに勇敢であることができるのであれば。<a href="#writing_package">パッケージの作成</a>をご確認ください。</p>

<a name="namespacing"></a>
<h2>名前空間</h2>

Meteor の名前空間のサポートを使うと、大規模 JavaScript アプリケーションの作成が簡単になります。アプリケーションで使うそれぞれのパッケージは、それら自身の隔離された名前空間に存在し、パッケージ自身のグローバル変数と特定の用途に向けて提供されている変数のみが参照可能です。どの様に動くかを説明していきます。

トップレベルで変数を宣言した場合、その変数をファイルスコープとするかパッケージスコープとするか選ぶことができます。

{% highlight javascript %}
// ファイルスコープ。この変数はこのファイル1つのみから参照可能です。
// このアプリケーションあるいはこのパッケージの他のファイルからは参照不可能です。
var alicePerson = {name: "alice"};

// パッケージスコープ。この変数はこのパッケージあるいはこのアプリケーションのどのファイル
// からも参照可能です。違いは 'var' が省略されていることです。
bobPerson = {name: "bob"};
{% endhighlight %}

<p>これはローカルあるいはグローバルの変数を宣言する、通常の JavaScript の文法です。Meteor はソースコードの中からグローバル変数の割り当てを探し、グローバル変数が適切な名前空間に確実に閉じ込めるラッパを作成します。</p>

<p>ファイルスコープとパッケージスコープに加え、エクスポートが存在します。エクスポートとは必要な時にパッケージを利用可能とする変数です。たとえば、email パッケージは Email 変数をエクスポートします。もしアプリケーションで email パッケージを使用し ( そして email パッケージのみを使用しているのなら) アプリケーションから Email が参照でき、Email.send を呼び出すことができます。多くのパッケージは1つのみエクスポートを持ちますが、いくつかのパッケージは2つもしくは3つ (たとえば、協調して動くいくつかのクラスを提供するパッケージ) 持つかもしれません。</p>

<p>参照可能であるのは直接使うパッケージのみです。もしパッケージ A を使用し、パッケージ A がパッケージ B を使用していた場合、パッケージ A のエクスポートのみ参照できます。あくまでパッケージ A が使用されているため、パッケージ B のエクスポートはあなたの名前空間に漏出してきません。この仕組でそれぞれの名前空間が美しく整理されます。それぞれのアプリケーションあるいはパッケージからは、それら自身のグルーバル変数と明示的に要求したパッケージの API のみが参照可能です。</p>

<p>アプリケーションのデバッグ中、ブラウザの JavaScript コンソールはアプリケーションの名前空間に含まれたかのように振る舞います。アプリケーションのグローバル変数とアプリケーションが直接使うパッケージのエクスポートが参照可能です。パッケージの中の変数と、中間的な依存関係 (アプリケーションにて直接的に使用されてなく、アプリケーションが使用しているパッケージが使用するるパッケージ) のエクスポートは参照不可能です。</p>

<p>もしパッケージの内部をブラウザのデバッガより確認したい場合、2つの方法があります。</p>

<ul>
  <li>パッケージコードの内部にブレークポイントを設定します。そのブレークポイントで停止している間は、コンソールはパッケージの名前空間の中にいることになります。パッケージのパッケージスコープの変数とインポート、そして停止されたファイルのファイルスコープの変数が参照可能です。</li>
  <li>パッケージ hoge がアプリケーションに含まれる場合、アプリケーションが直接使用しているかどうかにかかわらず、そのパッケージのエクスポートは Package.hoge にて利用できます。たとえば email パッケージが読み込まれた場合には email パッケージを直接使用してい名前空間からであっても、 Package.email.Email.send にアクセスすることができます。</li>
</ul>

関数を宣言する際は JavaScript では function x () {} は単なる var x = function () {} の簡略形ということに留意してください。次の例を考えてください。

{% highlight javascript %}
// これは 'var x = function ()' と同じです。つまり x() は
// ファイルスコープでこのファイル1つのみから呼び出し可能です。
function x () { ... }

// 'var' なし。つまり x() はパッケージスコープで、このアプリケーションか
// パッケージのいずれのファイルからでも呼び出し可能です。
x = function () { ... }
{% endhighlight %}

<div class="note">
技術的には、アプリケーションのグローバル群は (パッケージの中とは異なり) 実際にグローバルです。アプリケーションに対し秘匿された名前空間からそれらは参照不可能です。 なぜならその事で、その空間はデバッグ中にコンソールから参照不可能になるからです。アプリケーションのグローバル群は、実際には最終的にパッケージから参照可能となります。適切に記述されたパッケージコードであれば決してこれは問題になりません (アプリケーションのグローバルはパッケージ内の宣言によって適切に隠されるからです)。もちろん、このハックを利用すべきではありませんし、将来的に Meteor はこれをチェックし利用しているのであればエラーを投げるかもしれません。
</div>

<a name="deploying"></a>
<h2>デプロイ</h2>

<p>Meteor は最高のアプリケーションサーバです。インターネット上でアプリケーションを提供する際に必要なすべてを提供します。他にあなたが用意しなければならないのは、JavaScript、HTML そして CSS だけです。</p>

<h3>Meteor のインフラにデプロイする</h3>

<p>meteor deploy を使うと最も簡単にアプリケーションをデプロイできます。Meteor 開発チームがこの方法を提供しているのは、チームが個人的に常に「簡単に、創造性を奪うことなく、アプリケーションのアイデアを着想し、週末2日で具体化させ、世界から利用できる状態にする方法」を求めているためです。</p>

{% highlight bash %}
$ meteor deploy myapp.meteor.com
{% endhighlight %}

<p>作成したアプリケーションは myapp.meteor.com ですぐに利用可能になります。このホスト名に対しての最初のデプロイの場合は、Meteor は アプリケーション用の空のデータベースを作成します。更新版をデプロイしたい場合、Meteor は既にあるデータを持ち越し、コードのみを入れ替えます。</p>

<p>独自に用意したドメインにデプロイすることもできます。(ご利用のDNSサーバにて) 利用したいホスト名の CNAME に origin.meteor.com を設定し、その名前にデプロイしてください。</p>

{% highlight bash %}
$ meteor deploy www.myapp.com
{% endhighlight %}

<p>このサービスは Meteor の機能を体験を目的とした無料のサービスとして Meteor 開発チームにより提供されています。内部的ななベータ版やデモなどを素早く提供する際にも有用でしょう。<p>

<h3>独自のインフラストラクチャで運用する</h3>

<p>アプリケーションをお使いのインフラストラクチャや、Heroku の様なホスティングプロバイダ上で運用することもできます。<p>

<p>はじめるにあたり、下記を実行して下さい。</p>

{% highlight bash %}
$ meteor bundle myapp.tgz
{% endhighlight %}

<p>このコマンドは tarball の形ですべてを含んだ Node.js のアプリケーションを生成します。このアプリケーションを運用するにあたり、Node.js 0.10 と MongoDB サーバを用意する必要があります(現在の Meteor のリリースは Node 0.10.21 上にてテストを行っています) 。その後、アプリケーションが待機 (リッスン) する HTTP ポートと MongoDB のエンドポイントを指定し node を実行すると アプリケーションを実行することができます。もし MongoDB サーバをまだ用意していないのであれば、<a href="http://mongohq.com/">MongoHQ</a> のMeteor 開発チームのパートナをおすすめすめできます。</p>

{% highlight bash %}
$ PORT=3000 MONGO_URL=mongodb://localhost:27017/myapp node bundle/main.js
{% endhighlight %}

<p>パッケージによっては、他の環境変数を必要とする場合もあります (たとえば、email パッケージは MAIL_URL 環境変数を必要とします) 。</p>

<p><strong>現状、バンドルはそのバンドルが作成されたプラットフォーム上のみで実行可能です。異なるプラットフォーム上で実行するには、バンドルの中に含まれるネイティブパッケージをビルドしなおす必要があります。これを行うには、npm が利用可能であることを確認し、次のコマンドを実行してください。</strong></p>

{% highlight bash %}
$ cd bundle/server/node_modules
$ rm -r fibers
$ npm install fibers@1.0.0
{% endhighlight %}

<a name="writing_packages"></a>
<h2>パッケージの作成</h2>

Meteor パッケージのフォーマットは公式にはドキュメント化されていなく、 Meteor 1.0 の前に変更されるでしょう。しかし、これは毀損のパッケージのソースコードを読み、モデルに従いいく千ものパッケージを作成するあなたを止める理由にはならないでしょう。もしパッケージの作成を決意したのなら、暗中模索しなければなりませんが、いくつかの簡単なヒントをここに挙げます。

<ul>
  <li>パッケージとは package.js を含んだディレクトリです。たとえば、 <a href="https://github.com/meteor/meteor/tree/master/packages/">Meteor のソースツリーの packages ディレクトリ</a> の package.js ファイルをのぞいてみてください。フォーマットと package.js というファイル名は Meteor 1.0 の前に大幅に変更されますが、機能については文法が異なっていても基本的には同様なので、管理するのは簡単でしょう。</li>
  <li>パッケージは api.addfiles を使い明示的にすべてのソースファイルを一覧可能とし、そのファイルは指定された通りの順番で読み込まれます。(これはアプリケーションとはことなり、Meteor はソースファイルを探すためにディレクトリツリーを検索します。) 必要とするビルドプラグインパッケージ (coffeescript やHTMLテンプレートを利用する場合、templating) を含めるのを忘れないで下さい。</li>
  <li>パッケージ ( <a href="#namespacing">名前空間</a> をご確認ください) からのシンボルのエクスポートは on_use ハンドラの中の api.export によって実現されます。</li>
  <li>エクスポートに関する奥義:エクスポートされるものは = オペレータの左側というわけではありません。エクスポートした変数にエクスポート後に新しい値を設定することはできません。<code>a = {name: 'alice'}</code> をエクスポートした後はいつでも a.name 変更することができますが、起動後に a にまったく新しいオブジェクトを設定した場合、 aをインポートしたパッケージからは変更が確認できなくなります。エクスポート対象は大抵の場合オブジェクトか関数なので、これが問題になることはほとんどありません。</li>
  <li>パッケージは <a href="https://npmjs.org/">npm モジュール</a>を利用することができます。package.js の中で必要な npm モジュールと利用したい特定のバージョンを Npm.depends を使いリストしてください。そしてパッケージの中で必要なときに Npm.require を使いモジュールをひっぱり出してください。Meteor はチームメンバ全員が常に同じコードを実行するように、100%再利用可能なビルドを作成するよう努めます。そのため npm 依存関係を特定のバージョンに固定する必要があります。裏側では、Meteor は npm shrinkwrap を使い利用する npm モジュールの中間的な依存関係のバージョンも固定します。</li>
  <li>パッケージに変更された場合は毎回、Meteor は再ビルド (JavaScript ではないソースファイルのコンパイル、npm 依存関係の取得、名前空間ラッパの作成など) を行います。ビルドされたパッケージはキャッシュされ、ソースファイルの変更 (SHA1を使い追跡されます) があった場合あるいは他のビルドプラグインなどの他の依存に変更があった場合のみ再ビルドされます。再ビルドを強制する場合、ドキュメント化されていないコマンド meteor rebuild-all を使うことができますが、決して必要になることはないはずです (もしあればバグレポートを送ってください!) 。</li>
  <li>ビルドプラグインは _transitional_registerBuildPlugin により作成されますが、この API　は非常に流動的です。例として coffeescript パッケージを確認してください。ビルドプラグインはそれ自身で一人前の Meteor プログラムで、独自の名前空間とパッケージ依存性、ソースファイルと npm の必要条件を持っています。旧来の register_extension API は削除されました。
  <li>パッケージ間のゆるい依存関係を作成することも可能です。パッケージ A がパッケージ B にゆるい依存関係を持っている場合、アプリケーションが A を含むだ場合でも B は含まれる事を強制しません。しかしたとえばアプリケーションの開発者か他のパッケージにて B を含めた場合、B は A の前に読み込まれます。この仕組を使うと、他のパッケージが存在する場合に、そのオプションとして実装したパッケージを作ることや、他のパッケージを拡張することができます。ゆるい依存関係を作成するには、api.use の 3番目の引数として {weak: true}　を渡してください。ゆるく依存している際にはそのパッケージのエクスポートを参照することはできません。潜在的に存在するゆるい依存関係を持ったパッケージが存在するかどうかは、Package.hoge が存在するかどうかを確認することで判別でき、エクスポートは同じ箇所から取得することができます。</li>
  <li>{unordered: true} を渡すと順不同の依存関係を作ることができます。順不同の依存関係はゆるい依存関係と正反対です。A が B に順不同の依存関係を持つ場合、Aを含むとBも同様に含まれる事を強制しますが、BがAの前に読み込まれることにはつながりません。これは循環依存を解決する場合に便利かもしれません。</li>
  <li>ビルドシステムはまた、パッケージの暗示をサポートします。もしパッケージ A が パッケージ B を暗示した場合、誰かがパッケージ A に依存関係を持った場合、それはパッケージ B にも同様に依存関係を持っているようになります。つまり、その人は B のエクスポートも取得することになります。api.imply を使うとこれができ、一連のパッケージを要求する standard-app-packages の様な包括的なパッケージを作成するために使用したり、accounts-base と同様に一連のパッケージを追い出し共通のコードを抽出する場合に便利です。</li>
  <li>ビルドシステムはネイティブコードの思想を持ち合わせ、1つの特定のアーキテクチャ向けに設計されたパッケージが他のアーキテクチャ上で動かないようにするアーキテクチャ名のシステムがあります。たとえば、ネイティブ拡張をもつ npm パッケージを含めた場合、ビルドされた Meteor パッケージはそのアーキテクチャ専用となります、しかしそうでない場合は、Meteor パッケージのビルドは移植可能となります。</li>
</ul>

</article>
