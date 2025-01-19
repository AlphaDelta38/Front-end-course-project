import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type CustomText = {
    text: string,
};
type ParagraphElement = { type: 'paragraph' | "code"; children: CustomText[] };


declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: ParagraphElement;
        Text: CustomText;
    }
}