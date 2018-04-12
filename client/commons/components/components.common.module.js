'use strcit';

import angular from 'angular';

import AnimateNumberModule from './animate-number';
import LoopBannerModule from './loop-banner/loop.banner.common.component';
import TextEditorModule from './text-editor/text.editor.common.component';
import QuillRenderModule from './quill-render/quill.render.common.component';

export default angular
    .module('components.common.module', [AnimateNumberModule, LoopBannerModule, TextEditorModule, QuillRenderModule])
    .name;