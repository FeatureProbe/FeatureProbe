import { render } from '@testing-library/react';
import JSONbig from 'json-bigint';
import { createPatch } from 'diff';
import { html } from 'diff2html/lib/diff2html';
import '@testing-library/jest-dom';
import Diff from '.';

it('Diff snapshot', (done) => {
  (async () => {
    const before = JSONbig.stringify({}, null, 2);
    const after = JSONbig.stringify({ name: 'test' }, null, 2);
    const result = createPatch('content', before.replace(/\\n/g, '\n'), after.replace(/\\n/g, '\n'));
    const content = html(result, {
      matching: 'lines',
      outputFormat: 'side-by-side',
      diffStyle: 'word',
      drawFileList: false,
    });
    const { asFragment } = render(<Diff content={content} />);

    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

it('Diff opt', (done) => {
  (async () => {
    const before = JSONbig.stringify({}, null, 2);
    const after = JSONbig.stringify({ name: 'test' }, null, 2);
    const result = createPatch('content', before.replace(/\\n/g, '\n'), after.replace(/\\n/g, '\n'));
    const content = html(result, {
      matching: 'lines',
      outputFormat: 'side-by-side',
      diffStyle: 'word',
      drawFileList: false,
    });
    const { rerender } = render(<Diff key={1} maxHeight={500} height={500} content={content} />);
    const diffSides = document.getElementsByClassName('d2h-file-side-diff');
    diffSides[0].setAttribute('style', 'height: 600px;');
    diffSides[1].setAttribute('style', 'height: 600px;');

    diffSides[0].dispatchEvent(new Event('scroll'));
    diffSides[1].dispatchEvent(new Event('scroll'));

    let xSides = document.getElementsByClassName('d2h-code-wrapper');
    Object.defineProperty(xSides[0], 'clientWidth', {
      value: 500,
    });
    Object.defineProperty(xSides[0], 'scrollWidth', {
      value: 600,
    });
    rerender(<Diff key={1} maxHeight={510} height={500} content={content} />);

    rerender(<Diff key={2} maxHeight={510} height={500} content={content} />);
    xSides = document.getElementsByClassName('d2h-code-wrapper');
    Object.defineProperty(xSides[1], 'clientWidth', {
      value: 500,
    });
    Object.defineProperty(xSides[1], 'scrollWidth', {
      value: 600,
    });
    rerender(<Diff key={2} maxHeight={520} height={500} content={content} />);

    Object.defineProperty(xSides[0], 'clientWidth', {
      value: 500,
    });
    Object.defineProperty(xSides[0], 'scrollWidth', {
      value: 600,
    });
    rerender(<Diff key={2} maxHeight={530} height={500} content={content} />);

    done();
  })();
});
