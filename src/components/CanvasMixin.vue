<script>
export default {
  methods: {
    drawLine (ctx, x, y, width, height) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + width, y + height)
      ctx.stroke()
    },
    strokeArc (ctx, p, d, c, width = 1, sA = 0, eA = 360) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, d, sA * Math.PI / 180, eA * Math.PI / 180, false)
      this.stroke(ctx, c, width)
    },
    stroke (ctx, c = this.color, width = 1) {
      const oldLineWidth = ctx.lineWidth
      const oldStrokeStyle = ctx.strokeStyle
      ctx.strokeStyle = c
      ctx.lineWidth = width
      ctx.stroke()
      ctx.lineWidth = oldLineWidth
      ctx.strokeStyle = oldStrokeStyle
    }
  }
}
</script>
