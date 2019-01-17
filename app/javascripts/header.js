module.exports = {

  showHeader: function () {

    document.writeln('<nav class="navbar navbar-expand-lg navbar-light bg-light">');
    document.writeln('  <a class="navbar-brand" href="index.html">导航</a>');
    document.writeln('  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">');
    document.writeln('    <span class="navbar-toggler-icon"></span>');
    document.writeln('  </button>');
    document.writeln('');
    document.writeln('  <div class="collapse navbar-collapse" id="navbarSupportedContent">');
    document.writeln('    <ul class="navbar-nav mr-auto">');
    document.writeln('      <li class="nav-item active">');
    document.writeln('        <a class="nav-link" href="student.html">学生端</a>');
    document.writeln('      </li>');
    document.writeln('      <li class="nav-item active">');
    document.writeln('        <a class="nav-link" href="cook.html">厨师端</a>');
    document.writeln('      </li>');
    document.writeln('      <li class="nav-item active">');
    document.writeln('        <a class="nav-link" href="admin.html">管理后台</a>');
    document.writeln('      </li>');
    document.writeln('    </ul>');
    document.writeln('  </div>');
    document.writeln('</nav>');
  document.writeln('');

  },
}
