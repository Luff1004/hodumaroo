import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// INLINE_AUDIO=false 로 빌드하면 mp3를 별도 파일로 유지 (기본: HTML에 base64 인라인 = 완전한 단일 파일)
const INLINE_AUDIO = process.env.INLINE_AUDIO !== 'false';

// 게임 코드는 전역 스코프를 공유하는 클래식 스크립트(public/js/*.js)로 관리되므로,
// 빌드 후 dist/index.html에 CSS/JS/오디오를 직접 인라인해 단일 HTML을 만든다.
function singleFilePlugin() {
  return {
    name: 'hodumaroo-single-file',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist');
      const htmlPath = path.join(dist, 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf8');

      html = html.replace(/<link rel="stylesheet" href="\/(css\/[^"]+)">/g, (_, p) =>
        `<style>\n${fs.readFileSync(path.join(dist, p), 'utf8')}\n</style>`);

      html = html.replace(/<script src="\/(js\/[^"]+)"><\/script>/g, (_, p) =>
        `<script>\n${fs.readFileSync(path.join(dist, p), 'utf8')}\n</script>`);

      if (INLINE_AUDIO) {
        html = html.replace(/src="\/(assets\/[^"]+\.mp3)"/g, (_, p) =>
          `src="data:audio/mp3;base64,${fs.readFileSync(path.join(dist, p)).toString('base64')}"`);
        fs.rmSync(path.join(dist, 'assets'), { recursive: true, force: true });
      } else {
        // 외부 오디오 모드: file:// 로도 열리도록 상대 경로로 변경
        html = html.replace(/src="\/(assets\/[^"]+\.mp3)"/g, 'src="$1"');
      }

      fs.rmSync(path.join(dist, 'css'), { recursive: true, force: true });
      fs.rmSync(path.join(dist, 'js'), { recursive: true, force: true });
      fs.writeFileSync(htmlPath, html);

      const size = (fs.statSync(htmlPath).size / 1024 / 1024).toFixed(1);
      console.log(`\n  dist/index.html 생성 완료 (${size}MB, 오디오 ${INLINE_AUDIO ? '인라인' : '외부 파일'})\n`);
    },
  };
}

export default defineConfig({
  plugins: [singleFilePlugin()],
});
