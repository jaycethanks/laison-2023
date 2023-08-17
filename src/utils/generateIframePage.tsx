import { defineComponent } from 'vue';

const generateIframePage = (props: any) => {
  return defineComponent({
    render() {
      return (
        <div>
          <h1>Hello My friend</h1>
          <h2>{props}</h2>
        </div>
      );
    },
  });
};

export default generateIframePage;
