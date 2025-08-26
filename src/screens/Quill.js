import React from 'react';
import {Dimensions, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import QuillEditor from 'react-native-cn-quill';

const {width, height} = Dimensions.get('window');

export default function App() {
  const _editor = React.createRef();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="auto" />
      <QuillEditor
        style={styles.editor}
        ref={_editor}
        // onTextChange={text => {
        //   console.log('editor text:', text);
        // }}
        // onEditorChange={editor => {
        //   console.log('editor instance:', editor);
        // }}
        initialHtml=""
        customStyles={[
          `
            .ql-container {
              background-color:#000 !important;
              padding: 20px !important;
            }
            .ql-editor {
              color: white !important;
              font-size: 16px;
              padding: 0 10px !important;
              min-height: ${height * 0.15}px;
            }
        `,
        ]}
        onHtmlChange={html => {
          console.log('editor html:', html);
        }}
        onBlur={() => {
          console.log('editor blur!');
        }}
        onFocus={() => {
          console.log('editor focus!');
        }}
        // onSelectionChange={e => {
        //   console.log('selection change:', e);
        // }}
      />
      {/* <QuillToolbar editor={_editor} options="full" theme="light" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  root: {
    // flex: 1,
    height: height * 0.15,
    width: width * 0.9,
    borderRadius: 30,
  },
  editor: {
    padding: 0,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    width: width * 0.8,
    borderRadius: 30,
    overflow: 'hidden',
  },
});
