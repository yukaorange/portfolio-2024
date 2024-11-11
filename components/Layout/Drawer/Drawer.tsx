import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import styles from '@/components/Layout/Drawer/drawer.module.scss';
import { Marquee } from '@/components/Layout/Drawer/Marquee/Marquee';
import { Nav } from '@/components/Layout/Drawer/Nav/Nav';
import { TimeZone } from '@/components/Layout/Drawer/TimeZone/TimeZone';
import { toggleMenuOpen } from '@/store/toggleMenuAtom';

export const Drawer = () => {
  const [isOpen, setIsOpen] = useRecoilState(toggleMenuOpen);
  const [isOverlayClickable, setIsOverlayClickable] = useState(false);
  const mouseHoldRef = useRef(false);

  const menuAreaRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(0);
  const currentRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const isHandlingEventRef = useRef(false);

  const handleClose = () => {
    // e.preventDefault();
    // e.stopPropagation();

    setIsOpen(false);
  };

  const handleToggleMenu = (e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent) => {
    if (isHandlingEventRef.current) return;
    isHandlingEventRef.current = true;

    e.preventDefault();
    e.stopPropagation();

    // console.log('handleToggleMenu fired', {
    //   type: e.type,
    //   target: e.target,
    //   isOpen: isOpen,
    // });

    setIsOpen((prev: boolean) => !prev);

    setTimeout(() => {
      isHandlingEventRef.current = false;
    }, 100);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // console.log('handleTouchStart fired');

    startRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;

    drawerRef.current?.classList.add(styles.is_dragging);
    toggleRef.current?.classList.add(styles.is_dragging);

    hasMovedRef.current = false;
    currentRef.current = startRef.current;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // console.log('handleMouseDown fired');

    startRef.current = e.clientX;
    isDraggingRef.current = true;
    drawerRef.current?.classList.add(styles.is_dragging);
    toggleRef.current?.classList.add(styles.is_dragging);

    hasMovedRef.current = false;
    mouseHoldRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // console.log('handleMouseMove fired');

    if (!isDraggingRef.current) return;
    currentRef.current = e.clientX;
    hasMovedRef.current = true;
    updateDrawerPosition();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // console.log('handleTouchMove fired');

    if (!isDraggingRef.current) return;
    currentRef.current = e.touches[0].clientX;
    hasMovedRef.current = true;
    updateDrawerPosition();
  };

  const handleDragEnd = () => {
    // console.log('is mousehold ?', mouseHoldRef.current);
    mouseHoldRef.current = false;

    if (!isDraggingRef.current || isHandlingEventRef.current) return;

    isHandlingEventRef.current = true;
    isDraggingRef.current = false;

    const dragDistance = startRef.current - currentRef.current;

    // console.log('handleDragEnd fired', { dragDistance, hasMoved: hasMovedRef.current, event: e });

    if (Math.abs(dragDistance) > 75) {
      setIsOpen((prev: boolean) => !prev);
    } else if (!hasMovedRef.current || dragDistance <= 75) {
      //いずれにせよトグルは動作するようにした。冗長なので改善の余地あり。
      // console.log('not moved');
      setIsOpen((prev) => {
        // console.log('prev:', prev, '\n', 'next:', !prev);

        return !prev;
      });
    } else {
      // console.log("resetting drawer's position");
      // console.log({ dragDistance, hasMoved: hasMovedRef.current });
    }

    resetDrawerPosition();

    setTimeout(() => {
      isHandlingEventRef.current = false;
    }, 100);
  };

  const updateDrawerPosition = () => {
    if (!menuAreaRef.current) return;

    let dragAmount = Math.max(-300, startRef.current - currentRef.current);

    dragAmount = Math.min(dragAmount, 300);

    if (isOpen) {
      dragAmount = Math.min(dragAmount, 0);
    } else {
      dragAmount = Math.max(dragAmount, 0);
    }

    menuAreaRef.current.style.setProperty('--drug-amount', `${dragAmount}`);
  };

  const resetDrawerPosition = () => {
    if (!menuAreaRef.current) return;

    drawerRef.current?.classList.remove(styles.is_dragging);
    toggleRef.current?.classList.remove(styles.is_dragging);

    menuAreaRef.current.style.setProperty('--drug-amount', '0');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      resetDrawerPosition();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsOverlayClickable(true);
      }, 300); // 300ミリ秒のタイムラグを設定
    } else {
      setIsOverlayClickable(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      <div className={styles.menuarea} ref={menuAreaRef}>
        {/* toggleButton */}
        <div
          ref={toggleRef}
          className={`${styles.toggle} ${isOpen && styles.is_open}`}
          onTouchStart={(e) => {
            // console.log('on touch start');
            handleTouchStart(e);
          }}
          onTouchMove={(e) => {
            // console.log('on touch move');
            handleTouchMove(e);
          }}
          onTouchEnd={() => {
            // console.log('on touch end');
            handleDragEnd();
          }}
          onMouseDown={(e) => {
            // console.log('on mouse down');
            handleMouseDown(e);
          }}
          onMouseMove={(e) => {
            // console.log('on mouse move');
            handleMouseMove(e);
          }}
          onMouseUp={() => {
            // console.log('on mouse up');
            handleDragEnd();
          }}
          onMouseLeave={() => {
            // console.log('on mouse leave');
            if (mouseHoldRef.current == true) {
              // console.log('mouse holding', mouseHoldRef.current);
              handleDragEnd();
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <div className={styles.toggle__tab}>
            <ToggleTab />
            <div className={`${styles.toggle__arrow} ${isOpen && styles.is_open}`}>
              <PixelatedArrow />
            </div>
          </div>
          <div className={styles.toggle__bg}></div>
        </div>
        {/* drawer layer */}
        <div ref={drawerRef} className={`${styles.drawer} ${isOpen && styles.is_open}`}>
          <div className={styles.drawer__inner}>
            <div className={styles.drawer__content}>
              <div className={styles.drawer__nav}>
                <Nav onClick={handleClose} />
              </div>
              <div className={styles.drawer__timezone}>
                <TimeZone />
              </div>
            </div>
          </div>
          {/* closer */}
          <div
            className={styles.drawer__closer}
            onClick={handleToggleMenu}
            onKeyDown={(e) => e.key === 'Enter' && handleToggleMenu(e)}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-label="Close menu"
          >
            <Close />
          </div>
          {/* marquee */}
          <div className={styles.drawer__marquee}>
            <Marquee />
            <div className={styles.drawer__marquee__shadow}></div>
          </div>
        </div>
      </div>
      {/* overlay */}
      <div
        className={`${styles.overlay} ${isOpen && styles.is_open}`}
        onClick={isOverlayClickable ? handleToggleMenu : undefined}
        onKeyDown={(e) => e.key === 'Enter' && handleToggleMenu(e)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      ></div>
    </>
  );
};

interface ToggleTabProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  fill?: string;
}

const ToggleTab = ({ width = 15, height = 58, fill = '#EFC51E', ...props }: ToggleTabProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 15 58"
      fill="none"
      role="img"
      aria-label="Yellow bar"
      {...props}
    >
      <path d="M7.2 0L0 7.2V50.4L7.2 57.6H14.4V0H7.2Z" fill={fill} />
    </svg>
  );
};

interface PixelatedArrowProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  fillcolor?: string;
}
export const PixelatedArrow = ({
  width = 37,
  height = 27,
  fillcolor = '#F1F1F1',
  ...props
}: PixelatedArrowProps) => {
  const isOpen = useRecoilValue(toggleMenuOpen);
  const fill = isOpen ? '#151515' : fillcolor;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 37 27"
      fill="none"
      role="img"
      aria-label="Pixelated logo"
      {...props}
    >
      <g clipPath="url(#clip0_669_600)">
        <path
          d="M-9.77516e-06 14.88H2.73999L2.73999 12.14H-9.77516e-06L-9.77516e-06 14.88Z"
          fill={fill}
        />
        <path d="M4.05004 14.88H6.79004V12.14H4.05004V14.88Z" fill={fill} />
        <path d="M4.05004 18.92H6.79004V16.18H4.05004V18.92Z" fill={fill} />
        <path d="M4.05004 10.83H6.79004V8.09H4.05004V10.83Z" fill={fill} />
        <path d="M8.3601 14.88H11.1001V12.14H8.3601V14.88Z" fill={fill} />
        <path d="M8.3601 18.92H11.1001V16.18H8.3601V18.92Z" fill={fill} />
        <path d="M8.3601 22.97H11.1001V20.23H8.3601V22.97Z" fill={fill} />
        <path d="M8.3601 10.83H11.1001V8.09H8.3601V10.83Z" fill={fill} />
        <path d="M8.3601 6.78999H11.1001V4.04999H8.3601V6.78999Z" fill={fill} />
        <path d="M12.54 14.88H15.28V12.14H12.54V14.88Z" fill={fill} />
        <path d="M12.54 18.92H15.28V16.18H12.54V18.92Z" fill={fill} />
        <path d="M12.54 22.97H15.28V20.23H12.54V22.97Z" fill={fill} />
        <path d="M12.54 10.83H15.28V8.09H12.54V10.83Z" fill={fill} />
        <path d="M16.73 14.88H19.47V12.14H16.73V14.88Z" fill={fill} />
        <path d="M16.73 18.92H19.47V16.18H16.73V18.92Z" fill={fill} />
        <path d="M16.73 10.83H19.47V8.09H16.73V10.83Z" fill={fill} />
        <path d="M20.8899 14.88H23.6299V12.14H20.8899V14.88Z" fill={fill} />
        <path d="M20.8899 18.92H23.6299V16.18H20.8899V18.92Z" fill={fill} />
        <path d="M20.8899 10.83H23.6299V8.09H20.8899V10.83Z" fill={fill} />
        <path d="M25.0901 14.88H27.8301V12.14H25.0901V14.88Z" fill={fill} />
        <path d="M25.0901 18.92H27.8301V16.18H25.0901V18.92Z" fill={fill} />
        <path d="M25.0901 10.83H27.8301V8.09H25.0901V10.83Z" fill={fill} />
        <path d="M29.31 14.88H32.05V12.14H29.31V14.88Z" fill={fill} />
        <path d="M29.31 18.92H32.05V16.18H29.31V18.92Z" fill={fill} />
        <path d="M29.31 10.83H32.05V8.09H29.31V10.83Z" fill={fill} />
        <path d="M33.5601 14.88H36.3V12.14H33.5601V14.88Z" fill={fill} />
        <path d="M33.5601 18.92H36.3V16.18H33.5601V18.92Z" fill={fill} />
        <path d="M33.5601 10.83H36.3V8.09H33.5601V10.83Z" fill={fill} />
        <path d="M12.54 6.78999H15.28V4.04999H12.54V6.78999Z" fill={fill} />
        <path d="M12.54 2.74001L15.28 2.74001V5.48363e-06L12.54 5.48363e-06V2.74001Z" fill={fill} />
        <path d="M12.54 27.01H15.28V24.27H12.54V27.01Z" fill={fill} />
      </g>
      <defs>
        <clipPath id="clip0_669_600">
          <rect width="36.3" height="27.01" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Close = ({ size = 24, color = '#151515' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M29.484 0c-.13.004-.252.057-.343.15L17.164 12.13c-.49.47.235 1.197.706.707L29.846.857c.325-.318.1-.857-.363-.857zM12.488 17c-.13.004-.25.058-.34.15L.162 29.14c-.486.467.233 1.186.7.7L12.848 17.85c.325-.313.093-.85-.36-.85zM.5 0a.5.5 0 0 0-.348.86L29.14 29.845a.5.5 0 1 0 .706-.706L.86.152A.5.5 0 0 0 .5 0z" />
    </svg>
  );
};
