import './index.module.scss';
import 'diff2html/bundles/css/diff2html.min.css';
import { useEffect, useRef } from 'react';

interface DiffProps {
  content: string;
  height?: number;
  maxHeight?: number;
}

const Diff: React.FC<DiffProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(ref.current) {
      if(props.maxHeight && ref.current.clientHeight <= props.maxHeight) {
        ref.current.style.height = ref.current.clientHeight + 6 + 'px';
      }

      const ySides = ref.current.getElementsByClassName('d2h-file-side-diff');
      if(ySides[0] && ySides[1]) {
        ySides[0]?.addEventListener('scroll', function(e) {
          ySides[1].scrollTop = (e.target as HTMLDivElement).scrollTop;
        });
        ySides[1]?.addEventListener('scroll', function(e) {
          ySides[0].scrollTop = (e.target as HTMLDivElement).scrollTop;
        });
      }

      const xSides = ref.current.getElementsByClassName('d2h-code-wrapper');

      if(xSides[1].scrollWidth > xSides[1].clientWidth && xSides[0].scrollWidth === xSides[0].clientWidth) {
        ySides[0].setAttribute('style', 'padding-bottom: 10px');
      }

      if(xSides[0].scrollWidth > xSides[0].clientWidth && xSides[1].scrollWidth === xSides[1].clientWidth) {
        ySides[1].setAttribute('style', 'padding-bottom: 10px');
      }
    }
  }, [ref, props.maxHeight]);

  return (
    <div 
      style={{
        height: props.height ?? 'unset',
        maxHeight: props.maxHeight ?? 'unset'
      }} 
      ref={ref} 
      className="diff" 
      dangerouslySetInnerHTML={{ __html: props.content }} 
    />
  );
};

export default Diff;
