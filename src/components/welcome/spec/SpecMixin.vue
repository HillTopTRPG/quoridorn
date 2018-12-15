<script>
import SpecFrame from './SpecFrame'
import SpecItem from './SpecItem'
import SpecLink from './SpecLink'
export default {
  components: { SpecFrame, SpecItem, SpecLink },
  methods: {
    openLink (id) {
      const elm = document.getElementById('welcomeWindowContents').querySelector('#' + id)
      if (!elm) {
        console.error(`Not found => #${id}`)
        return
      }
      console.log(elm)
      if (!elm.checked) elm.click()
    }
  }
}
</script>
