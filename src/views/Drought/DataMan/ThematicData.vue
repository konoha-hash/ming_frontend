<template>
  <div class="thematicData">
    <h1>专题数据管理</h1>

    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
      <div slot="footer"><b>ant design vue</b> footer part</div>
      <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
        <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type">
          <a-icon :type="type" style="margin-right: 8px" />
          {{ text }}
        </span>
        </template>
        <img
            slot="extra"
            width="272"
            alt="logo"
            src="/static/pic/植被物种分类-最大似然法.jpg"
        />
        <a-list-item-meta :description="item.description">
          <a slot="title" :href="item.href">{{ item.title }}</a>
          <a-avatar slot="avatar" :src="item.avatar" />
        </a-list-item-meta>
        {{ item.content }}
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'https://www.antdv.com/',
    title: `ant design vue part ${i}`,
    avatar: '/static/pic/植被物种分类-最大似然法.jpg',
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

export default {
  name: "ThematicData",
  data() {
    return {
      listData,
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 3,
      },
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' },
      ],
    };
  },
}
</script>

<style lang="scss">
.thematicData{
  height: 100%;
  width: 95vw;
  margin: 40px;
}
</style>